"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorReading = void 0;
const mongoose_1 = require("mongoose");
const sensorReadingSchema = new mongoose_1.Schema({
    device_id: { type: String, required: true, trim: true, index: true },
    timestamp: { type: Date, required: true, index: true },
    sensors: {
        temperature: { type: Number, required: true },
        humidity: { type: Number, required: true },
        distance: { type: Number, required: true },
        motion: { type: Number, required: true },
    },
    alerts: {
        fall_detected: { type: Boolean, required: true },
        fever_detected: { type: Boolean, required: true },
        emergency: { type: Boolean, required: true },
    },
}, { timestamps: true });
sensorReadingSchema.index({ device_id: 1, timestamp: -1 });
exports.SensorReading = (0, mongoose_1.model)('SensorReading', sensorReadingSchema);
