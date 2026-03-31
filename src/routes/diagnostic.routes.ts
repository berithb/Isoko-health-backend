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

const updateSchema = z.object({
  body: z.object({
    type: z.string().optional(),
    result: z.string().optional(),
    status: z.enum(['requested', 'in-progress', 'completed']).optional(),
  }),
  params: z.object({ id: z.string() }),
});

const idSchema = z.object({ params: z.object({ id: z.string() }) });

router.post('/', authenticate, validate(requestSchema), DiagnosticController.requestTest);
router.patch('/:id/result', authenticate, authorize(['doctor', 'admin']), validate(uploadSchema), DiagnosticController.uploadResult);
router.get('/', authenticate, DiagnosticController.getResults);
router.get('/all', authenticate, authorize(['admin']), DiagnosticController.list);
router.get('/:id', authenticate, validate(idSchema), DiagnosticController.getOne);
router.put('/:id', authenticate, authorize(['doctor', 'admin']), validate(updateSchema), DiagnosticController.update);
router.delete('/:id', authenticate, authorize(['admin']), validate(idSchema), DiagnosticController.remove);

export default router;

