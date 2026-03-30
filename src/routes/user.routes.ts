import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { z } from 'zod';

const router = Router();

const updateSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
  }),
});

router.get('/me', authenticate, UserController.getProfile);
router.put('/me', authenticate, validate(updateSchema), UserController.updateProfile);
router.get('/', authenticate, authorize(['admin']), UserController.listUsers);
router.delete('/:id', authenticate, authorize(['admin']), UserController.deleteUser);

export default router;
