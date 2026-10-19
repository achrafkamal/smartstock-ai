import dotenv from 'dotenv';
import { createApp } from './src/app.js';
import { sequelize } from './src/config/database.js';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const app = createApp();

async function start() {
  try {
    // Connect to PostgreSQL
    await sequelize.authenticate();
    console.log('PostgreSQL database connected via Sequelize.');

    // Sync database models
    await sequelize.sync();
    console.log('Database models synchronized.');

    // Ensure default demo admin exists
    const { User } = await import('./src/models/User.js');
    const userCount = await User.count();
    if (userCount === 0) {
      const bcrypt = (await import('bcryptjs')).default;
      const hashedPassword = await bcrypt.hash('Password123', 10);
      await User.create({
        name: 'Administrateur',
        email: 'admin@smartstock.ma',
        password: hashedPassword,
        role: 'ADMIN',
      });
      console.log('Initial demo admin created: admin@smartstock.ma / Password123');
    }

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`=========================================`);
      console.log(`SmartStock AI Backend running on port ${PORT}`);
      console.log(`Local URL: http://localhost:${PORT}/api`);
      console.log(`Network URL: http://0.0.0.0:${PORT}/api`);
      console.log(`=========================================`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await sequelize.close();
        console.log('Server and database connection closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
