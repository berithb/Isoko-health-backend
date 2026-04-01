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
exports.remove = exports.update = exports.getOne = exports.fetchHistory = exports.fetchLatest = exports.create = exports.index = void 0;
const socket_1 = require("../realtime/socket");
const SensorDataService = __importStar(require("../services/sensorData.service"));
const index = (_req, res) => {
    res.json({
        status: 'ok',
        message: 'Sensor data API is available.',
        endpoints: {
            post: '/api/v1/data',
            latest: '/api/v1/data/latest',
            history: '/api/v1/data/history',
        },
    });
};
exports.index = index;
const create = async (req, res, next) => {
    try {
        const reading = await SensorDataService.createSensorReading(req.body);
        (0, socket_1.emitSensorData)(typeof reading.toJSON === 'function' ? reading.toJSON() : reading);
        res.status(201).json({ status: 'success', id: String(reading._id) });
    }
    catch (err) {
        next(err);
    }
};
exports.create = create;
const fetchLatest = async (_req, res, next) => {
    try {
        const latest = await SensorDataService.fetchLatestSensorReading();
        if (!latest) {
            return res.json({ status: 'empty' });
        }
        return res.json(latest);
    }
    catch (err) {
        next(err);
    }
};
exports.fetchLatest = fetchLatest;
const fetchHistory = async (req, res, next) => {
    try {
        const history = await SensorDataService.fetchSensorHistory({
            device_id: req.query.device_id,
            limit: req.query.limit,
        });
        res.json(history);
    }
    catch (err) {
        next(err);
    }
};
exports.fetchHistory = fetchHistory;
const getOne = async (req, res, next) => {
    try {
        const reading = await SensorDataService.getSensorReadingById(req.params.id);
        res.json(reading);
    }
    catch (err) {
        next(err);
    }
};
exports.getOne = getOne;
const update = async (req, res, next) => {
    try {
        const reading = await SensorDataService.updateSensorReading(req.params.id, req.body);
        res.json(reading);
    }
    catch (err) {
        next(err);
    }
};
exports.update = update;
const remove = async (req, res, next) => {
    try {
        const reading = await SensorDataService.deleteSensorReading(req.params.id);
        res.json(reading);
    }
    catch (err) {
        next(err);
    }
};
exports.remove = remove;
