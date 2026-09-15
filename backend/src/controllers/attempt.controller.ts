import type { Request, Response } from 'express';
import { Attempt } from '../models/Attempt';
import { Scenario } from '../models/Scenario';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/error.middleware';

/**
 * POST /api/attempts
 * Body: { scenario: string; selectedOption: string; reasoning?: string }
 * Correctness and score are always derived server-side from the scenario's
 * stored options — never trusted from the client.
 */
export const createAttempt = asyncHandler(async (req: Request, res: Response) => {
  const { scenario: scenarioId, selectedOption, reasoning } = req.body ?? {};

  if (typeof scenarioId !== 'string' || typeof selectedOption !== 'string') {
    throw new AppError('scenario and selectedOption are required', 400);
  }

  const scenario = await Scenario.findById(scenarioId);
  if (!scenario || !scenario.isActive) {
    throw new AppError('Scenario not found', 404);
  }

  const option = scenario.options.find((o) => o.id === selectedOption);
  if (!option) {
    throw new AppError('Invalid option for this scenario', 400);
  }

  const correct = option.isCorrect;

  const attempt = await Attempt.create({
    user: req.userId,
    scenario: scenario._id,
    selectedOption,
    correct,
    score: correct ? 100 : 0,
    reasoning: typeof reasoning === 'string' ? reasoning.slice(0, 500) : undefined,
  });

  res.status(201).json({ success: true, data: attempt });
});

/**
 * GET /api/attempts
 * Returns attempts for the requesting user if known, otherwise the most
 * recent attempts overall (useful for local/demo use before auth exists).
 */
export const getAttempts = asyncHandler(async (req: Request, res: Response) => {
  const filter = req.userId ? { user: req.userId } : {};

  const attempts = await Attempt.find(filter).sort({ createdAt: -1 }).limit(200).populate('scenario');

  res.status(200).json({ success: true, count: attempts.length, data: attempts });
});
