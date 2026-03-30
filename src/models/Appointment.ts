import { Schema, model, Document, Types } from 'mongoose';

export type AppointmentStatus = 'pending' | 'completed' | 'cancelled';

export interface IAppointment extends Document {
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  date: Date;
  status: AppointmentStatus;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  },
  { timestamps: true },
);

export const Appointment = model<IAppointment>('Appointment', appointmentSchema);

