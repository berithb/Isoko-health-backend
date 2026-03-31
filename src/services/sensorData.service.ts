import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import { SensorReading } from '../models/SensorReading';

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
    return memoryReadings.at(-1) ?? null;
  }

  return SensorReading.findOne().sort({ timestamp: -1, createdAt: -1 }).lean();
};

export const fetchSensorHistory = async ({ device_id, limit = 50 }: HistoryOptions) => {
  if (!isDatabaseReady()) {
    const filtered = device_id ? memoryReadings.filter((reading) => reading.device_id === device_id) : memoryReadings;
    return filtered.slice(-limit).reverse();
  }

  const query = device_id ? { device_id } : {};

  return SensorReading.find(query).sort({ timestamp: -1, createdAt: -1 }).limit(limit).lean();
};
