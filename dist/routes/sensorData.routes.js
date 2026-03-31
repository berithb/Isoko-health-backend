"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const SensorDataController = __importStar(require("../controllers/sensorData.controller"));
const validation_middleware_1 = require("../middlewares/validation.middleware");
const router = (0, express_1.Router)();
const isoDateSchema = zod_1.z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'timestamp must be a valid ISO date string',
});
const createSensorDataSchema = zod_1.z.object({
    body: zod_1.z.object({
        device_id: zod_1.z.string().min(1),
        timestamp: isoDateSchema,
        sensors: zod_1.z.object({
            temperature: zod_1.z.number(),
            humidity: zod_1.z.number(),
            distance: zod_1.z.number(),
            motion: zod_1.z.number(),
        }),
        alerts: zod_1.z.object({
            fall_detected: zod_1.z.boolean(),
            fever_detected: zod_1.z.boolean(),
            emergency: zod_1.z.boolean(),
        }),
    }),
});
const historyQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        device_id: zod_1.z.string().min(1).optional(),
        limit: zod_1.z.coerce.number().int().min(1).max(500).optional(),
    }),
    body: zod_1.z.object({}).optional(),
    params: zod_1.z.object({}).optional(),
});
router.post('/', (0, validation_middleware_1.validate)(createSensorDataSchema), SensorDataController.create);
router.get('/latest', SensorDataController.fetchLatest);
router.get('/history', (0, validation_middleware_1.validate)(historyQuerySchema), SensorDataController.fetchHistory);
exports.default = router;
