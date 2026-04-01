"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSensorReading = exports.updateSensorReading = exports.getSensorReadingById = exports.fetchSensorHistory = exports.fetchLatestSensorReading = exports.createSensorReading = void 0;
const crypto_1 = require("crypto");
const mongoose_1 = __importDefault(require("mongoose"));
const SensorReading_1 = require("../models/SensorReading");
const config_1 = require("../config");
const apiError_1 = require("../utils/apiError");
const memoryReadings = [];
const isDatabaseReady = () => mongoose_1.default.connection.readyState === 1;
const buildMemoryReading = (payload) => {
    const now = new Date();
    return {
        _id: (0, crypto_1.randomUUID)(),
        ...payload,
        timestamp: new Date(payload.timestamp),
        createdAt: now,
        updatedAt: now,
    };
};
const createSensorReading = async (payload) => {
    if (!isDatabaseReady()) {
        if (!config_1.env.allowSensorMemoryFallback) {
            throw new apiError_1.ApiError(503, 'Sensor data storage is unavailable because MongoDB is not connected.');
        }
        const reading = buildMemoryReading(payload);
        memoryReadings.push(reading);
        return reading;
    }
    const reading = await SensorReading_1.SensorReading.create({
        ...payload,
        timestamp: new Date(payload.timestamp),
    });
    return reading;
};
exports.createSensorReading = createSensorReading;
const fetchLatestSensorReading = async () => {
    if (!isDatabaseReady()) {
        if (!config_1.env.allowSensorMemoryFallback) {
            throw new apiError_1.ApiError(503, 'Sensor data is unavailable because MongoDB is not connected.');
        }
        return memoryReadings.at(-1) ?? null;
    }
    return SensorReading_1.SensorReading.findOne().sort({ timestamp: -1, createdAt: -1 }).lean();
};
exports.fetchLatestSensorReading = fetchLatestSensorReading;
const fetchSensorHistory = async ({ device_id, limit = 50 }) => {
    if (!isDatabaseReady()) {
        if (!config_1.env.allowSensorMemoryFallback) {
            throw new apiError_1.ApiError(503, 'Sensor history is unavailable because MongoDB is not connected.');
        }
        const filtered = device_id ? memoryReadings.filter((reading) => reading.device_id === device_id) : memoryReadings;
        return filtered.slice(-limit).reverse();
    }
    const query = device_id ? { device_id } : {};
    return SensorReading_1.SensorReading.find(query).sort({ timestamp: -1, createdAt: -1 }).limit(limit).lean();
};
exports.fetchSensorHistory = fetchSensorHistory;
const getSensorReadingById = async (id) => {
    if (!isDatabaseReady()) {
        const reading = memoryReadings.find((r) => r._id === id);
        if (!reading)
            throw new apiError_1.ApiError(404, 'Sensor reading not found');
        return reading;
    }
    const reading = await SensorReading_1.SensorReading.findById(id);
    if (!reading)
        throw new apiError_1.ApiError(404, 'Sensor reading not found');
    return reading;
};
exports.getSensorReadingById = getSensorReadingById;
const updateSensorReading = async (id, payload) => {
    if (!isDatabaseReady()) {
        const idx = memoryReadings.findIndex((r) => r._id === id);
        if (idx === -1)
            throw new apiError_1.ApiError(404, 'Sensor reading not found');
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
    const reading = await SensorReading_1.SensorReading.findByIdAndUpdate(id, { ...payload, timestamp: payload.timestamp ? new Date(payload.timestamp) : undefined }, { new: true });
    if (!reading)
        throw new apiError_1.ApiError(404, 'Sensor reading not found');
    return reading;
};
exports.updateSensorReading = updateSensorReading;
const deleteSensorReading = async (id) => {
    if (!isDatabaseReady()) {
        const idx = memoryReadings.findIndex((r) => r._id === id);
        if (idx === -1)
            throw new apiError_1.ApiError(404, 'Sensor reading not found');
        const [removed] = memoryReadings.splice(idx, 1);
        return removed;
    }
    const reading = await SensorReading_1.SensorReading.findByIdAndDelete(id);
    if (!reading)
        throw new apiError_1.ApiError(404, 'Sensor reading not found');
    return reading;
};
exports.deleteSensorReading = deleteSensorReading;
