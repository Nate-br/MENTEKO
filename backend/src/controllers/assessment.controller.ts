import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Assessment } from '../models/Assessment';
import { Attempt } from '../models/Attempt';
import type { ScenarioCategory } from '../models/Scenario';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/error.middleware';

/**
 * POST /api/assessments
 * Body: { attempts: string[] }  — ids of previously recorded Attempt documents
 * Aggregates those attempts into a scored assessment with a per-category
 * breakdown of strengths and weaknesses.
 */
export const createAssessment = asyncHandler(async (req: Request, res: Response) => {
  const { attempts: attemptIds } = req.body ?? {};

  if (!Array.isArray(attemptIds) || attemptIds.length === 0) {
    throw new AppError('attempts must be a non-empty array of attempt ids', 400);
  }

  const validIds = attemptIds.filter((id: unknown) => typeof id === 'string' && Types.ObjectId.isValid(id));
  if (validIds.length === 0) {
    throw new AppError('No valid attempt ids provided', 400);
  }

  const attempts = await Attempt.find({ _id: { $in: validIds } }).populate<{
    scenario: { category: ScenarioCategory };
  }>('scenario');

  if (attempts.length === 0) {
    throw new AppError('No matching attempts found', 404);
  }

  const breakdownMap = new Map<ScenarioCategory, { correct: number; total: number }>();

  for (const attempt of attempts) {
    const category = attempt.scenario?.category as ScenarioCategory | undefined;
    if (!category) continue;

    const current = breakdownMap.get(category) ?? { correct: 0, total: 0 };
    current.total += 1;
    if (attempt.correct) current.correct += 1;
    breakdownMap.set(category, current);
  }

  const correctAnswers = attempts.filter((a) => a.correct).length;
  const totalQuestions = attempts.length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  const assessment = await Assessment.create({
    user: req.userId,
    totalQuestions,
    correctAnswers,
    score,
    categoryBreakdown: Array.from(breakdownMap.entries()).map(([category, v]) => ({
      category,
      ...v,
    })),
  });

  res.status(201).json({ success: true, data: assessment });
});

/**
 * GET /api/assessments/:id
 */
export const getAssessment = asyncHandler(async (req: Request, res: Response) => {
  const assessment = await Assessment.findById(req.params.id);

  if (!assessment) {
    throw new AppError('Assessment not found', 404);
  }

  res.status(200).json({ success: true, data: assessment });
});
