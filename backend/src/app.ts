import express, { Express } from 'express';
import { userRouter } from './routes/user.routes.js';
import { productRouter } from './routes/product.routes.js';
import { stockRouter } from './routes/stock.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

export function createApp(): Express {
  const app = express();

  // Zero-dependency CORS headers for Web / Expo / Mobile clients
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Root / Health check route
  app.get('/api', (_req, res) => {
    res.json({
      success: true,
      message: 'SmartStock AI API is running',
      version: '1.0.0',
    });
  });

  app.get('/api/health', (_req, res) => {
    res.json({
      success: true,
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  // Routes (support both /api/users and /api/auth alias for authentication)
  app.use('/api/users', userRouter);
  app.use('/api/auth', userRouter);
  app.use('/api/products', productRouter);
  app.use('/api/stock', stockRouter);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default createApp;
