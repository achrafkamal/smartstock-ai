import { createApp } from './src/app.js';
import { env } from './src/config/env.js';
import { prisma } from './src/config/prisma.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 SmartStock AI Backend is running`);
  console.log(`📡 URL: http://localhost:${env.PORT}`);
  console.log(`🩺 Health: http://localhost:${env.PORT}/api/health`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
  console.log(`=========================================`);
});

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  server.close(async () => {
    console.log('🔌 HTTP server closed.');
    try {
      await prisma.$disconnect();
      console.log('📦 Database connection disconnected.');
    } catch (err) {
      console.error('Error disconnecting database:', err);
    }
    process.exit(0);
  });

  // Force shutdown after timeout
  setTimeout(() => {
    console.error('⚠️ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
