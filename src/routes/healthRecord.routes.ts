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

const idSchema = z.object({ params: z.object({ id: z.string() }) });

router.post('/', authenticate, validate(vitalsSchema), HealthController.submit);
router.get('/', authenticate, HealthController.fetch);
router.get('/:id', authenticate, validate(idSchema), HealthController.getOne);
router.put('/:id', authenticate, validate(vitalsSchema.merge(idSchema)), HealthController.update);
router.delete('/:id', authenticate, validate(idSchema), HealthController.remove);

export default router;

