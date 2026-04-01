"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const mongoose_1 = require("mongoose");
const subscriptionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive', 'cancelled'], default: 'active' },
}, { timestamps: true });
subscriptionSchema.index({ userId: 1, status: 1 });
exports.Subscription = (0, mongoose_1.model)('Subscription', subscriptionSchema);
