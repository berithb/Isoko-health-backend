import { Response, NextFunction } from 'express';
import * as AppointmentService from '../services/appointment.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Types } from 'mongoose';

export const book = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const appointment = await AppointmentService.bookAppointment({ ...req.body, patientId: req.user!.id });
    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
};

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filter =
      req.user?.role === 'doctor'
        ? { doctorId: new Types.ObjectId(req.user.id) }
        : { patientId: new Types.ObjectId(req.user!.id) };
    const appointments = await AppointmentService.getAppointments(filter);
    res.json(appointments);
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const appointment = await AppointmentService.updateAppointmentStatus(req.params.id, req.body.status);
    res.json(appointment);
  } catch (err) {
    next(err);
  }
};
