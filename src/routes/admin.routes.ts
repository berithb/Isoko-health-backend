import { Router } from 'express';
import { z } from 'zod';
import * as AdminController from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

const subSchema = z.object({
  body: z.object({
    plan: z.string(),
    status: z.enum(['active', 'inactive', 'cancelled']),
  }),
  params: z.object({ userId: z.string() }),
});

const roleSchema = z.object({
  body: z.object({
    role: z.enum(['patient', 'doctor', 'admin', 'caregiver']),
  }),
  params: z.object({ userId: z.string() }),
});

router.get('/users', AdminController.manageUsers);
router.put('/users/:userId/subscription', authenticate, authorize(['admin']), validate(subSchema), AdminController.manageSubscription);
router.put('/users/:userId/role', authenticate, authorize(['admin']), validate(roleSchema), AdminController.updateRole);
router.get('/analytics', authenticate, authorize(['admin']), AdminController.analytics);

export default router;
