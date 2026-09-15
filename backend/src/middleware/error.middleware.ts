import type { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

export function errorHandler(err: Error | AppError, _req: Request, res: Response, _next: NextFunction): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError && err.isOperational ? err.message : 'Internal server error';

  if (statusCode >= 500) {
    console.error('[error]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}
