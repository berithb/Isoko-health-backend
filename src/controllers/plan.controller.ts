import { Response, NextFunction } from 'express';
import * as PlanService from '../services/plan.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const list = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const plans = await PlanService.listPlans();
    res.json(plans);
  } catch (err) {
    next(err);
  }
};
