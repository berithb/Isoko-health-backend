import { AnyZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';

export const validate =
  (schema: AnyZodObject) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });
    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join('; ');
      return next(new ApiError(400, message));
    }
    Object.assign(req, result.data);
    return next();
  };

