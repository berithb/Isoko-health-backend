import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, token } = await AuthService.register(req.body);
    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, token } = await AuthService.login(req.body.email, req.body.password);
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AuthService.requestPasswordReset(req.body.email);
    res.json({ message: 'Reset token generated', ...data });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, token } = await AuthService.resetPassword(req.body.token, req.body.password);
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    next(err);
  }
};

export const listRoles = (_req: Request, res: Response) => {
  res.json({ roles: ['patient', 'doctor', 'admin', 'caregiver'] });
};
