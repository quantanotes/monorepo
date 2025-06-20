import { PGliteWorker } from '@electric-sql/pglite/worker';
import { electricSync } from '@electric-sql/pglite-sync';
import { live } from '@electric-sql/pglite/live';
import { vector } from '@electric-sql/pglite/vector';
import { drizzle } from 'drizzle-orm/pglite';
import PGWorker from './worker.js?worker';
import type { DB } from '../types';
import type { PGlite } from '@electric-sql/pglite';

const dbName = 'quanta' as const;

export async function initDB() {
  const debug = 0;

  const db = await PGliteWorker.create(new PGWorker(), {
    relaxedDurability: true,
    dataDir: 'idb://quanta',
    extensions: {
      live,
      vector,
      electric: electricSync({ debug: !!debug }),
    },
    debug,
    meta: {
      dbName,
    },
  });

  const orm = drizzle({
    client: db as unknown as PGlite,
    casing: 'snake_case',
  });

  Object.defineProperty(db, 'orm', {
    value: orm,
    writable: false,
  });

  await db.waitReady;

  return db as unknown as DB;
}
