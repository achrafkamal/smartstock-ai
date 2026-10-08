import express, { Express } from 'express';
import cors from 'cors';
import { userRouter } from './routes/user.routes.js';
import { productRouter } from './routes/product.routes.js';
import { stockRouter } from './routes/stock.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(cors());
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

  // API Routes
  app.use('/api/users', userRouter);
  app.use('/api/products', productRouter);
  app.use('/api/stock', stockRouter);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default createApp;
