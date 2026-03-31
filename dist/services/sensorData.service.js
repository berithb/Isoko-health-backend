"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSensorHistory = exports.fetchLatestSensorReading = exports.createSensorReading = void 0;
const crypto_1 = require("crypto");
const mongoose_1 = __importDefault(require("mongoose"));
const SensorReading_1 = require("../models/SensorReading");
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
        return memoryReadings.at(-1) ?? null;
    }
    return SensorReading_1.SensorReading.findOne().sort({ timestamp: -1, createdAt: -1 }).lean();
};
exports.fetchLatestSensorReading = fetchLatestSensorReading;
const fetchSensorHistory = async ({ device_id, limit = 50 }) => {
    if (!isDatabaseReady()) {
        const filtered = device_id ? memoryReadings.filter((reading) => reading.device_id === device_id) : memoryReadings;
        return filtered.slice(-limit).reverse();
    }
    const query = device_id ? { device_id } : {};
    return SensorReading_1.SensorReading.find(query).sort({ timestamp: -1, createdAt: -1 }).limit(limit).lean();
};
exports.fetchSensorHistory = fetchSensorHistory;
