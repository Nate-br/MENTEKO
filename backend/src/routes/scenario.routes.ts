import { Router } from 'express';
import { getScenarios, getScenarioById } from '../controllers/scenario.controller';

const router = Router();

router.get('/', getScenarios);
router.get('/:id', getScenarioById);

export default router;
