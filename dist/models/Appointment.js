"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
const mongoose_1 = require("mongoose");
const appointmentSchema = new mongoose_1.Schema({
    patientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true });
appointmentSchema.index({ patientId: 1, date: -1 });
appointmentSchema.index({ doctorId: 1, date: -1 });
exports.Appointment = (0, mongoose_1.model)('Appointment', appointmentSchema);
