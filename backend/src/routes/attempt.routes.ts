import { Router } from 'express';
import { createAttempt, getAttempts } from '../controllers/attempt.controller';

const router = Router();

router.post('/', createAttempt);
router.get('/', getAttempts);

export default router;
