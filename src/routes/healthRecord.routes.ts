import { Router } from 'express';
import { z } from 'zod';
import * as HealthController from '../controllers/healthRecord.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

const vitalsSchema = z.object({
  body: z.object({
    bloodPressure: z.string().optional(),
    glucose: z.number().optional(),
    temperature: z.number().optional(),
  }),
});

router.post('/', authenticate, validate(vitalsSchema), HealthController.submit);
router.get('/', authenticate, HealthController.fetch);

export default router;

