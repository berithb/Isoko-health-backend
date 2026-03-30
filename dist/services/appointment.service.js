"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppointmentStatus = exports.getAppointments = exports.bookAppointment = void 0;
const apiError_1 = require("../utils/apiError");
const Appointment_1 = require("../models/Appointment");
const bookAppointment = async (data) => Appointment_1.Appointment.create(data);
exports.bookAppointment = bookAppointment;
const getAppointments = async (filter) => Appointment_1.Appointment.find(filter);
exports.getAppointments = getAppointments;
const updateAppointmentStatus = async (id, status) => {
    const appointment = await Appointment_1.Appointment.findById(id);
    if (!appointment)
        throw new apiError_1.ApiError(404, 'Appointment not found');
    appointment.status = status;
    await appointment.save();
    return appointment;
};
exports.updateAppointmentStatus = updateAppointmentStatus;
