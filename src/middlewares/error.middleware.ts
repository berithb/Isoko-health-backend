import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message, details: err.details ?? undefined });
};

