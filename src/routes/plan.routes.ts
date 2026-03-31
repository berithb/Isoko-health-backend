import { Router } from 'express';
import * as PlanController from '../controllers/plan.controller';

const router = Router();

// Public endpoint: pricing page can load without authentication
router.get('/', PlanController.list);

export default router;
