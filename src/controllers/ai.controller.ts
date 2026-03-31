import { Request, Response, NextFunction } from 'express';
import { runFeature, AiFeature } from '../services/ai.service';

export const handleAi = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { feature, payload } = req.body as { feature: AiFeature; payload: any };
    if (!feature) {
      return res.status(400).json({ message: 'feature is required' });
    }
    const result = await runFeature(feature, payload);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
