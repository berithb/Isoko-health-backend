"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.getDbStatus = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DEFAULT_LOCAL_MONGO_URI = 'mongodb://localhost:27017/isokohealth';
const normalizedNodeEnv = process.env.NODE_ENV?.trim().toLowerCase() || 'development';
const configuredMongoUri = process.env.MONGO_URI?.trim();
const allowMongoLocalFallback = normalizedNodeEnv !== 'production';
const allowSensorMemoryFallback = process.env.ALLOW_SENSOR_MEMORY_FALLBACK?.trim().toLowerCase() !== 'false';
const resolveMongoUri = () => {
    if (configuredMongoUri) {
        return configuredMongoUri;
    }
    if (allowMongoLocalFallback) {
        return DEFAULT_LOCAL_MONGO_URI;
    }
    throw new Error('MONGO_URI is required when NODE_ENV=production');
};
const MONGO_URI = resolveMongoUri();
const connectDB = async () => {
    mongoose_1.default.connection.on('connected', () => console.log('MongoDB connected'));
    mongoose_1.default.connection.on('error', (err) => console.error('MongoDB error', err));
    await mongoose_1.default.connect(MONGO_URI);
};
exports.connectDB = connectDB;
const getDbStatus = () => ({
    connected: mongoose_1.default.connection.readyState === 1,
    readyState: mongoose_1.default.connection.readyState,
    hasConfiguredMongoUri: Boolean(configuredMongoUri),
    usingLocalMongoFallback: !configuredMongoUri && allowMongoLocalFallback,
});
exports.getDbStatus = getDbStatus;
exports.env = {
    port: Number(process.env.PORT) || 4000,
    host: process.env.HOST || '0.0.0.0',
    corsOrigin: process.env.CORS_ORIGIN || (normalizedNodeEnv === 'production' ? '' : '*'),
    nodeEnv: normalizedNodeEnv,
    jwtSecret: process.env.JWT_SECRET || (normalizedNodeEnv === 'production' ? '' : 'dev_secret_change_me'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    allowSensorMemoryFallback: process.env.ALLOW_SENSOR_MEMORY_FALLBACK === 'true',
    geminiApiKey: process.env.GEMINI_API_KEY,
};
// Validate critical env vars in production
if (normalizedNodeEnv === 'production') {
    if (!exports.env.corsOrigin) {
        throw new Error('CORS_ORIGIN is required in production. Set it to your frontend domain(s), e.g., "https://myapp.com"');
    }
    if (!exports.env.jwtSecret || exports.env.jwtSecret.length < 32) {
        throw new Error('JWT_SECRET must be at least 32 characters in production');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is required in production');
    }
}
