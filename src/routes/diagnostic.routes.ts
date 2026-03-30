import { Router } from 'express';
import { z } from 'zod';
import * as DiagnosticController from '../controllers/diagnostic.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

const requestSchema = z.object({
  body: z.object({
    type: z.string(),
  }),
});

const uploadSchema = z.object({
  body: z.object({ result: z.string() }),
  params: z.object({ id: z.string() }),
});

router.post('/', authenticate, validate(requestSchema), DiagnosticController.requestTest);
router.patch('/:id/result', authenticate, authorize(['doctor', 'admin']), validate(uploadSchema), DiagnosticController.uploadResult);
router.get('/', authenticate, DiagnosticController.getResults);

export default router;

