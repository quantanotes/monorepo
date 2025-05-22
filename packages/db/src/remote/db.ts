import { drizzle } from 'drizzle-orm/postgres-js';

export const db = drizzle({
  connection: {
    url: process.env.DATABASE_URL!,
    prepare: process.env.NODE_ENV === 'production',
  },
  casing: 'snake_case',
});

export type DB = typeof db;
