import type { PgliteDatabase } from 'drizzle-orm/pglite';
import type { LiveNamespace } from '@electric-sql/pglite/live';
import type {
  PGliteWithSync,
  SyncShapeToTableOptions,
  SyncShapeToTableResult,
} from '@electric-sql/pglite-sync';
import * as schema from './schema';
import { tables } from './tables';

export type DB = PGliteWithSync & {
  orm: PgliteDatabase<typeof schema>;
  vector: unknown;
  live: LiveNamespace;
  electric: {
    initMetadataTables: () => Promise<void>;
    syncShapeToTable: (
      options: SyncShapeToTableOptions,
    ) => Promise<SyncShapeToTableResult>;
  };
};

export type ChangeSet = {
  [T in (typeof tables)[number] as T['schemaName']]: T['schema']['$inferInsert'][];
};
