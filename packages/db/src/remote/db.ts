import { drizzle } from 'drizzle-orm/neon-serverless';

export const db = drizzle({
  connection: process.env.DATABASE_URL!,
  casing: 'snake_case',
});

export type DB = typeof db;
