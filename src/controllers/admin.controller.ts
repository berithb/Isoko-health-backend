import { Response, NextFunction } from 'express';
import * as UserService from '../services/user.service';
import * as AdminService from '../services/admin.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const manageUsers = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await UserService.listUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const manageSubscription = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const subscription = await AdminService.manageSubscription(req.params.userId, req.body.plan, req.body.status);
    res.json(subscription);
  } catch (err) {
    next(err);
  }
};

export const analytics = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await AdminService.getAnalytics();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const updateRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await AdminService.updateUserRole(req.params.userId, req.body.role);
    res.json(user);
  } catch (err) {
    next(err);
  }
};
