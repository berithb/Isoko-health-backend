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
exports.updateStatus = exports.list = exports.book = void 0;
const AppointmentService = __importStar(require("../services/appointment.service"));
const mongoose_1 = require("mongoose");
const book = async (req, res, next) => {
    try {
        const appointment = await AppointmentService.bookAppointment({ ...req.body, patientId: req.user.id });
        res.status(201).json(appointment);
    }
    catch (err) {
        next(err);
    }
};
exports.book = book;
const list = async (req, res, next) => {
    try {
        const filter = req.user?.role === 'doctor'
            ? { doctorId: new mongoose_1.Types.ObjectId(req.user.id) }
            : { patientId: new mongoose_1.Types.ObjectId(req.user.id) };
        const appointments = await AppointmentService.getAppointments(filter);
        res.json(appointments);
    }
    catch (err) {
        next(err);
    }
};
exports.list = list;
const updateStatus = async (req, res, next) => {
    try {
        const appointment = await AppointmentService.updateAppointmentStatus(req.params.id, req.body.status);
        res.json(appointment);
    }
    catch (err) {
        next(err);
    }
};
exports.updateStatus = updateStatus;
