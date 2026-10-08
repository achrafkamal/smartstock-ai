import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || 'postgresql://smartstock:smartstock_secret@localhost:5432/smartstock_db';

// Clean URL parameter if schema is appended
let cleanUrl = databaseUrl;
try {
  const urlObj = new URL(databaseUrl);
  urlObj.searchParams.delete('schema');
  cleanUrl = urlObj.toString();
} catch {
  // Use as-is if not standard URL
}

export const sequelize = new Sequelize(cleanUrl, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export default sequelize;
