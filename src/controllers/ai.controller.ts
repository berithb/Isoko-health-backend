import { Request, Response, NextFunction } from 'express';
import { runFeature, AiFeature } from '../services/ai.service';

export const handleAi = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { feature, payload, previewOnly } = req.body as { feature: AiFeature; payload: any; previewOnly?: boolean };
    if (!feature) {
      return res.status(400).json({ message: 'feature is required' });
    }
    const result = await runFeature(feature, payload, Boolean(previewOnly));
    res.json(result);
  } catch (err) {
    next(err);
  }
};
