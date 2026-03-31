import { Response, NextFunction } from 'express';
import * as DoctorService from '../services/doctor.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const list = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const doctors = await DoctorService.listDoctors();
    res.json(doctors);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const doctor = await DoctorService.getDoctorById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (err) {
    next(err);
  }
};
