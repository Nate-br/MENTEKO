import { Router } from 'express';
import { createAssessment, getAssessment } from '../controllers/assessment.controller';

const router = Router();

router.post('/', createAssessment);
router.get('/:id', getAssessment);

export default router;
