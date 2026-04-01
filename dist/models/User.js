"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin', 'caregiver'],
        default: 'patient'
    },
    // Added Doctor Specific Fields
    specialization: { type: String },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: false },
    consultationFee: { type: Number },
    consultationMethods: [{ type: String, enum: ['Chat', 'Video'] }],
    avatar: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
}, { timestamps: { createdAt: true, updatedAt: true } } // Changed updatedAt to true for profile edits
);
userSchema.pre('save', async function hashPassword(next) {
    if (!this.isModified('password'))
        return next();
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
    next();
});
userSchema.methods.comparePassword = async function comparePassword(candidate) {
    return bcryptjs_1.default.compare(candidate, this.password);
};
userSchema.methods.generatePasswordReset = function generatePasswordReset() {
    const token = crypto_1.default.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
    this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    return token;
};
userSchema.methods.clearPasswordReset = function clearPasswordReset() {
    this.passwordResetToken = undefined;
    this.passwordResetExpires = undefined;
};
exports.User = (0, mongoose_1.model)('User', userSchema);
