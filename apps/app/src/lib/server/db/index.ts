import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
const client = postgres(DATABASE_URL, { prepare: false })
export const db = drizzle({ client });
export * as schema from '#/db/remote/schema';
