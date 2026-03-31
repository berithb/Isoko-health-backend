import { Response, NextFunction } from 'express';
import * as HealthService from '../services/healthRecord.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const submit = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const record = await HealthService.submitVitals({ ...req.body, userId: req.user!.id });
    const alerts = HealthService.detectAlerts(req.body);
    res.status(201).json({ record, alerts });
  } catch (err) {
    next(err);
  }
};

export const fetch = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const records = await HealthService.fetchVitals(req.user!.id);
    res.json(records);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const record = await HealthService.getRecordById(req.params.id);
    res.json(record);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const record = await HealthService.updateRecord(req.params.id, req.body);
    res.json(record);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const record = await HealthService.deleteRecord(req.params.id);
    res.json(record);
  } catch (err) {
    next(err);
  }
};

