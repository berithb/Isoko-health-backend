import { Types } from 'mongoose';
import { ApiError } from '../utils/apiError';
import { Appointment, IAppointment, AppointmentStatus } from '../models/Appointment';

export type AppointmentPayload = {
  patientId: Types.ObjectId | string;
  doctorId: Types.ObjectId | string;
  date: Date;
  status?: AppointmentStatus;
};

export const bookAppointment = async (data: AppointmentPayload) => Appointment.create(data);

export const getAppointments = async (filter: Partial<{ patientId: Types.ObjectId | string; doctorId: Types.ObjectId | string }>) =>
  Appointment.find(filter);

export const getAppointmentById = async (id: string) => {
  const appointment = await Appointment.findById(id);
  if (!appointment) throw new ApiError(404, 'Appointment not found');
  return appointment;
};

export const updateAppointment = async (id: string, payload: Partial<AppointmentPayload>) => {
  const appointment = await Appointment.findByIdAndUpdate(id, payload, { new: true });
  if (!appointment) throw new ApiError(404, 'Appointment not found');
  return appointment;
};

export const updateAppointmentStatus = async (id: string, status: IAppointment['status']) => {
  const appointment = await Appointment.findById(id);
  if (!appointment) throw new ApiError(404, 'Appointment not found');
  appointment.status = status;
  await appointment.save();
  return appointment;
};

export const deleteAppointment = async (id: string) => {
  const appointment = await Appointment.findByIdAndDelete(id);
  if (!appointment) throw new ApiError(404, 'Appointment not found');
  return appointment;
};
