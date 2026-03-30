"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = exports.getUserById = exports.login = exports.register = void 0;
const apiError_1 = require("../utils/apiError");
const User_1 = require("../models/User");
const jwt_1 = require("../utils/jwt");
const crypto_1 = __importDefault(require("crypto"));
const register = async (data) => {
    const exists = await User_1.User.findOne({ email: data.email });
    if (exists)
        throw new apiError_1.ApiError(409, 'Email already registered');
    const user = await User_1.User.create({ ...data, role: 'patient' });
    const token = (0, jwt_1.signToken)(user);
    return { user, token };
};
exports.register = register;
const login = async (email, password) => {
    const user = await User_1.User.findOne({ email });
    if (!user)
        throw new apiError_1.ApiError(401, 'Invalid credentials');
    const valid = await user.comparePassword(password);
    if (!valid)
        throw new apiError_1.ApiError(401, 'Invalid credentials');
    const token = (0, jwt_1.signToken)(user);
    return { user, token };
};
exports.login = login;
const getUserById = async (id) => User_1.User.findById(id);
exports.getUserById = getUserById;
const requestPasswordReset = async (email) => {
    const user = await User_1.User.findOne({ email });
    if (!user)
        throw new apiError_1.ApiError(404, 'User not found');
    const token = user.generatePasswordReset();
    await user.save();
    // In production, send email. Here we return token for testing.
    return { resetToken: token, expiresAt: user.passwordResetExpires };
};
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = async (token, newPassword) => {
    const hashed = crypto_1.default.createHash('sha256').update(token).digest('hex');
    const user = await User_1.User.findOne({
        passwordResetToken: hashed,
        passwordResetExpires: { $gt: new Date() },
    });
    if (!user)
        throw new apiError_1.ApiError(400, 'Invalid or expired token');
    user.password = newPassword;
    user.clearPasswordReset();
    await user.save();
    return { user, token: (0, jwt_1.signToken)(user) };
};
exports.resetPassword = resetPassword;
