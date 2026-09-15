import type { Request, Response } from 'express';
import { Scenario } from '../models/Scenario';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/error.middleware';

/**
 * GET /api/scenarios
 * Supports optional ?category= and ?difficulty= filters. Only active
 * scenarios are returned to the client.
 */
export const getScenarios = asyncHandler(async (req: Request, res: Response) => {
  const { category, difficulty } = req.query;

  const filter: Record<string, unknown> = { isActive: true };
  if (typeof category === 'string') filter.category = category;
  if (typeof difficulty === 'string') filter.difficulty = difficulty;

  const scenarios = await Scenario.find(filter).sort({ createdAt: 1 });

  res.status(200).json({ success: true, count: scenarios.length, data: scenarios });
});

/**
 * GET /api/scenarios/:id
 */
export const getScenarioById = asyncHandler(async (req: Request, res: Response) => {
  const scenario = await Scenario.findById(req.params.id);

  if (!scenario || !scenario.isActive) {
    throw new AppError('Scenario not found', 404);
  }

  res.status(200).json({ success: true, data: scenario });
});
