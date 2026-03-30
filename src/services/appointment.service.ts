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

export const updateAppointmentStatus = async (id: string, status: IAppointment['status']) => {
  const appointment = await Appointment.findById(id);
  if (!appointment) throw new ApiError(404, 'Appointment not found');
  appointment.status = status;
  await appointment.save();
  return appointment;
};
