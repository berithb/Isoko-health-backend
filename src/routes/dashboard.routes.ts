import { Router } from 'express';
import * as DashboardController from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, DashboardController.getDashboard);

export default router;
