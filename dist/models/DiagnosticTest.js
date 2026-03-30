"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosticTest = void 0;
const mongoose_1 = require("mongoose");
const diagnosticSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    result: String,
    status: { type: String, enum: ['requested', 'in-progress', 'completed'], default: 'requested' },
}, { timestamps: true });
exports.DiagnosticTest = (0, mongoose_1.model)('DiagnosticTest', diagnosticSchema);
