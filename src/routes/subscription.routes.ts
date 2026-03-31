import { Router } from 'express';
import { z } from 'zod';
import * as SubscriptionController from '../controllers/subscription.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

const baseSchema = z.object({
  body: z.object({
    userId: z.string(),
    plan: z.string(),
    status: z.enum(['active', 'inactive', 'cancelled']).optional(),
  }),
});

const updateSchema = z.object({
  body: z.object({
    plan: z.string().optional(),
    status: z.enum(['active', 'inactive', 'cancelled']).optional(),
  }),
  params: z.object({ id: z.string() }),
});

const idSchema = z.object({ params: z.object({ id: z.string() }) });

router.post('/', authenticate, authorize(['admin']), validate(baseSchema), SubscriptionController.create);
router.get('/', authenticate, authorize(['admin']), SubscriptionController.list);
router.get('/:id', authenticate, authorize(['admin']), validate(idSchema), SubscriptionController.getOne);
router.put('/:id', authenticate, authorize(['admin']), validate(updateSchema), SubscriptionController.update);
router.delete('/:id', authenticate, authorize(['admin']), validate(idSchema), SubscriptionController.remove);

export default router;
