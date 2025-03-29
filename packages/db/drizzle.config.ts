import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
dotenv.config({
  path:
    process.env.NODE_ENV === 'production' ? '../../.env' : '../../.env.local',
});
export default defineConfig({
  schema: './src/remote/schema',
  out: './src/remote/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  casing: 'snake_case',
  verbose: true,
  strict: true,
  dialect: 'postgresql',
});
