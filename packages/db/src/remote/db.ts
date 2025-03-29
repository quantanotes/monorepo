import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
export const client = postgres(process.env.DATABASE_URL!, {
  prepare: process.env.NODE_ENV === 'production',
});
export const db = drizzle({ client, casing: 'snake_case', logger: true });
export type DB = typeof db;
