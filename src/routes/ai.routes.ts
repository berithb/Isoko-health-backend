import { Router } from 'express';
import { handleAi } from '../controllers/ai.controller';

const router = Router();

router.post('/', handleAi);

export default router;
