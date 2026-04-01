import { Router } from 'express';
import * as DoctorController from '../controllers/doctor.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public endpoint so landing and consultation pages can surface data
router.get('/', DoctorController.list);
router.get('/:id', DoctorController.getOne);

router.post('/', authenticate, authorize(['admin']), DoctorController.create);
router.patch('/:id', authenticate, authorize(['admin']), DoctorController.update);

export default router;
