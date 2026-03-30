"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/isokohealth';
const connectDB = async () => {
    await mongoose_1.default.connect(MONGO_URI);
    mongoose_1.default.connection.on('connected', () => console.log('MongoDB connected'));
    mongoose_1.default.connection.on('error', (err) => console.error('MongoDB error', err));
};
exports.connectDB = connectDB;
exports.env = {
    port: Number(process.env.PORT) || 4000,
    jwtSecret: process.env.JWT_SECRET || 'change_me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
};
