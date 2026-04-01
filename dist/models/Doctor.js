"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doctor = void 0;
const mongoose_1 = require("mongoose");
const doctorSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    specialty: { type: String, required: true },
    bio: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewsCount: { type: Number, default: 0, min: 0 },
    consultationFee: { type: String, required: true },
    consultationModes: [{
            type: String,
            enum: ['chat', 'video']
        }],
    languages: [{
            type: String
        }],
    experienceYears: { type: Number, min: 0 },
    availabilityStatus: {
        type: String,
        enum: ['Available', 'Busy', 'Offline'],
        default: 'Available'
    },
    nextAvailable: String,
}, { timestamps: true });
exports.Doctor = (0, mongoose_1.model)('Doctor', doctorSchema);
