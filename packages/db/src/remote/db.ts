import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

export const db =
  globalThis.globalDB ||
  drizzle({
    client: postgres(process.env.DATABASE_URL!),
    casing: 'snake_case',
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.globalDB = db;
}

export type DB = ReturnType<typeof drizzle>;

declare global {
  var globalDB: DB;
}
