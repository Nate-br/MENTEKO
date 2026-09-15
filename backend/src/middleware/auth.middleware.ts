import type { Request, Response, NextFunction } from 'express';

/**
 * MENTEKO does not yet implement authentication (see MVP scope — the core
 * training experience must work before auth/admin features are added).
 *
 * This middleware is a placeholder: if a future request carries a user id
 * (e.g. via a header or session), it attaches it to `req.userId` so
 * controllers can optionally associate attempts/assessments with a user.
 * It never blocks a request.
 */
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

export function attachUserIfPresent(req: Request, _res: Response, next: NextFunction): void {
  const userId = req.header('x-user-id');
  if (userId) {
    req.userId = userId;
  }
  next();
}
