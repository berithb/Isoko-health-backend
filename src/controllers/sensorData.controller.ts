import { NextFunction, Request, Response } from 'express';
import * as SensorDataService from '../services/sensorData.service';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reading = await SensorDataService.createSensorReading(req.body);
    res.status(201).json({ status: 'success', id: String(reading._id) });
  } catch (err) {
    next(err);
  }
};

export const fetchLatest = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const latest = await SensorDataService.fetchLatestSensorReading();

    if (!latest) {
      return res.json({ status: 'empty' });
    }

    return res.json(latest);
  } catch (err) {
    next(err);
  }
};

export const fetchHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const history = await SensorDataService.fetchSensorHistory({
      device_id: req.query.device_id as string | undefined,
      limit: req.query.limit as number | undefined,
    });

    res.json(history);
  } catch (err) {
    next(err);
  }
};
