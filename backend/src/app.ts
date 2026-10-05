import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';

import { attachUserIfPresent } from './middleware/auth.middleware';
import { notFoundHandler, errorHandler } from './middleware/error.middleware';
import { isDatabaseConnected } from './config/database';

import scenarioRoutes from './routes/scenario.routes';
import attemptRoutes from './routes/attempt.routes';
import assessmentRoutes from './routes/assessment.routes';
import userRoutes from './routes/user.routes';

export function createApp(): Application {
  const app = express();

  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // Basic rate limiting on write-heavy endpoints to reduce abuse.
  const writeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/attempts', writeLimiter);
  app.use('/api/assessments', writeLimiter);

  app.use(attachUserIfPresent);

  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      database: isDatabaseConnected() ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/scenarios', scenarioRoutes);
  app.use('/api/attempts', attemptRoutes);
  app.use('/api/assessments', assessmentRoutes);
  app.use('/api/users', userRoutes);

  // In production (or when frontend/dist is built), serve frontend SPA
  const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
  if (fs.existsSync(frontendDistPath)) {
    app.use(express.static(frontendDistPath));
    app.use((req: Request, res: Response, next) => {
      // Don't intercept unhandled /api calls or non-GET requests
      if (req.method !== 'GET' || req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
