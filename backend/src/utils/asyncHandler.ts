import type { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export function asyncHandler(fn: AsyncFn): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
