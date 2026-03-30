import { Router } from 'express';
import { z } from 'zod';
import * as AppointmentController from '../controllers/appointment.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

const bookSchema = z.object({
  body: z.object({
    doctorId: z.string(),
    date: z.string().transform((d) => new Date(d)),
  }),
});

const statusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'completed', 'cancelled']),
  }),
  params: z.object({ id: z.string() }),
});

router.post('/', authenticate, authorize(['patient', 'caregiver']), validate(bookSchema), AppointmentController.book);
router.get('/', authenticate, AppointmentController.list);
router.patch('/:id/status', authenticate, authorize(['doctor', 'admin']), validate(statusSchema), AppointmentController.updateStatus);

export default router;
