import express, { Express } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { healthRouter } from './routes/health.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/error.js';

export function createApp(): Express {
  const app = express();

  // Basic security and parsing middleware
  app.use(
    cors({
      origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Basic request logger for development
  if (env.NODE_ENV === 'development') {
    app.use((req, _res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      next();
    });
  }

  // API Routes
  app.use('/api', healthRouter);

  // Fallback and Error Handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default createApp;
