import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import { SensorReading } from '../models/SensorReading';
import { env } from '../config';
import { ApiError } from '../utils/apiError';

export interface SensorPayload {
  device_id: string;
  timestamp: string;
  sensors: {
    temperature: number;
    humidity: number;
    distance: number;
    motion: number;
  };
  alerts: {
    fall_detected: boolean;
    fever_detected: boolean;
    emergency: boolean;
  };
}

interface HistoryOptions {
  device_id?: string;
  limit?: number;
}

interface StoredSensorReading extends Omit<SensorPayload, 'timestamp'> {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  timestamp: Date;
}

const memoryReadings: StoredSensorReading[] = [];

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const buildMemoryReading = (payload: SensorPayload): StoredSensorReading => {
  const now = new Date();

  return {
    _id: randomUUID(),
    ...payload,
    timestamp: new Date(payload.timestamp),
    createdAt: now,
    updatedAt: now,
  };
};

export const createSensorReading = async (payload: SensorPayload) => {
  if (!isDatabaseReady()) {
    if (!env.allowSensorMemoryFallback) {
      throw new ApiError(503, 'Sensor data storage is unavailable because MongoDB is not connected.');
    }

    const reading = buildMemoryReading(payload);
    memoryReadings.push(reading);
    return reading;
  }

  const reading = await SensorReading.create({
    ...payload,
    timestamp: new Date(payload.timestamp),
  });

  return reading;
};

export const fetchLatestSensorReading = async () => {
  if (!isDatabaseReady()) {
    if (!env.allowSensorMemoryFallback) {
      throw new ApiError(503, 'Sensor data is unavailable because MongoDB is not connected.');
    }

    return memoryReadings.at(-1) ?? null;
  }

  return SensorReading.findOne().sort({ timestamp: -1, createdAt: -1 }).lean();
};

export const fetchSensorHistory = async ({ device_id, limit = 50 }: HistoryOptions) => {
  if (!isDatabaseReady()) {
    if (!env.allowSensorMemoryFallback) {
      throw new ApiError(503, 'Sensor history is unavailable because MongoDB is not connected.');
    }

    const filtered = device_id ? memoryReadings.filter((reading) => reading.device_id === device_id) : memoryReadings;
    return filtered.slice(-limit).reverse();
  }

  const query = device_id ? { device_id } : {};

  return SensorReading.find(query).sort({ timestamp: -1, createdAt: -1 }).limit(limit).lean();
};

export const getSensorReadingById = async (id: string) => {
  if (!isDatabaseReady()) {
    const reading = memoryReadings.find((r) => r._id === id);
    if (!reading) throw new ApiError(404, 'Sensor reading not found');
    return reading;
  }

  const reading = await SensorReading.findById(id);
  if (!reading) throw new ApiError(404, 'Sensor reading not found');
  return reading;
};

export const updateSensorReading = async (id: string, payload: Partial<SensorPayload>) => {
  if (!isDatabaseReady()) {
    const idx = memoryReadings.findIndex((r) => r._id === id);
    if (idx === -1) throw new ApiError(404, 'Sensor reading not found');
    const merged = {
      ...memoryReadings[idx],
      ...payload,
      sensors: { ...memoryReadings[idx].sensors, ...(payload.sensors || {}) },
      alerts: { ...memoryReadings[idx].alerts, ...(payload.alerts || {}) },
      timestamp: payload.timestamp ? new Date(payload.timestamp) : memoryReadings[idx].timestamp,
      updatedAt: new Date(),
    };
    memoryReadings[idx] = merged;
    return merged;
  }

  const reading = await SensorReading.findByIdAndUpdate(
    id,
    { ...payload, timestamp: payload.timestamp ? new Date(payload.timestamp) : undefined },
    { new: true },
  );
  if (!reading) throw new ApiError(404, 'Sensor reading not found');
  return reading;
};

export const deleteSensorReading = async (id: string) => {
  if (!isDatabaseReady()) {
    const idx = memoryReadings.findIndex((r) => r._id === id);
    if (idx === -1) throw new ApiError(404, 'Sensor reading not found');
    const [removed] = memoryReadings.splice(idx, 1);
    return removed;
  }

  const reading = await SensorReading.findByIdAndDelete(id);
  if (!reading) throw new ApiError(404, 'Sensor reading not found');
  return reading;
};
