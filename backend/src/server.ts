import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`=========================================`);
  console.log(`SmartStock AI Backend is running`);
  console.log(`URL: http://localhost:${env.PORT}`);
  console.log(`Health: http://localhost:${env.PORT}/api/health`);
  console.log(`Environment: ${env.NODE_ENV}`);
  console.log(`=========================================`);
});

const gracefulShutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

  server.close(async () => {
    console.log('HTTP server closed.');
    try {
      await prisma.$disconnect();
      console.log('Database connection disconnected.');
    } catch (error) {
      console.error('Error disconnecting database:', error);
    }
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));