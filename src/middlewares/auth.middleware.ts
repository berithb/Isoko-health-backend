import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { getUserById } from '../services/auth.service';
import { ApiError } from '../utils/apiError';
import { UserRole } from '../models/User';

export interface AuthRequest extends Request {
  user?: { id: string; role: UserRole };
}

export const authenticate = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next(new ApiError(401, 'Missing token'));
  try {
    const token = header.split(' ')[1];
    const payload = verifyToken(token);
    const user = await getUserById(payload.sub);
    if (!user) return next(new ApiError(401, 'Invalid token'));
    req.user = { id: user.id, role: user.role };
    return next();
  } catch (err) {
    return next(new ApiError(401, 'Invalid token'));
  }
};

export const authorize =
  (roles: UserRole[]) => (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new ApiError(401, 'Unauthorized'));
    if (!roles.includes(req.user.role)) return next(new ApiError(403, 'Forbidden'));
    return next();
  };

