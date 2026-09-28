import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';

export const healthRouter = Router();

healthRouter.get('/health', async (_req: Request, res: Response) => {
  let dbStatus = 'disconnected';

  try {
    // Ping PostgreSQL to verify actual connectivity
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'error';
    console.error('Healthcheck DB ping failed:', error instanceof Error ? error.message : error);
  }

  const isHealthy = dbStatus === 'connected';

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    message: isHealthy
      ? 'SmartStock AI API is running'
      : 'SmartStock AI API is running but database is unreachable',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});
