import { Response, NextFunction } from 'express';
import * as DashboardService from '../services/dashboard.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const data = await DashboardService.getDashboardData(req.user);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
