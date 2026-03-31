import { Router } from 'express';
import * as DoctorController from '../controllers/doctor.controller';

const router = Router();

// Public endpoint so landing and consultation pages can surface data
router.get('/', DoctorController.list);
router.get('/:id', DoctorController.getOne);

export default router;
