import type { Request, Response } from 'express';
import { User } from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/error.middleware';

/**
 * POST /api/users
 * Creates a lightweight user record. MENTEKO does not implement
 * authentication yet (see MVP scope); this exists so attempts/assessments
 * can optionally be associated with a named trainee.
 */
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email } = req.body ?? {};

  if (typeof name !== 'string' || typeof email !== 'string' || !name.trim() || !email.trim()) {
    throw new AppError('name and email are required', 400);
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    res.status(200).json({ success: true, data: existing });
    return;
  }

  const user = await User.create({ name: name.trim(), email: email.trim() });
  res.status(201).json({ success: true, data: user });
});

/**
 * GET /api/users/:id
 */
export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.status(200).json({ success: true, data: user });
});
