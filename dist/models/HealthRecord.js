"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthRecord = void 0;
const mongoose_1 = require("mongoose");
const healthRecordSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    bloodPressure: String,
    glucose: Number,
    temperature: Number,
}, { timestamps: { createdAt: true, updatedAt: false } });
healthRecordSchema.index({ userId: 1, createdAt: -1 });
exports.HealthRecord = (0, mongoose_1.model)('HealthRecord', healthRecordSchema);
