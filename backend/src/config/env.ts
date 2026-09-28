import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .optional()
    .default('5000')
    .transform((val) => parseInt(val, 10)),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z
    .string({
      required_error: 'DATABASE_URL environment variable is required',
    })
    .min(1, 'DATABASE_URL cannot be empty')
    .refine(
      (url) => url.startsWith('postgresql://') || url.startsWith('postgres://'),
      {
        message: 'DATABASE_URL must be a valid PostgreSQL connection string',
      }
    ),
  JWT_SECRET: z
    .string()
    .min(10, 'JWT_SECRET should be at least 10 characters')
    .default('smartstock_jwt_dev_secret_key_graduation_project_2026'),
  CORS_ORIGIN: z.string().default('*'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables configuration:');
  console.error(JSON.stringify(parsedEnv.error.format(), null, 2));
  process.exit(1);
}

export const env = parsedEnv.data;
