import type { PgliteDatabase } from 'drizzle-orm/pglite';
import type { PGliteInterface } from '@electric-sql/pglite';
import type { LiveNamespace } from '@electric-sql/pglite/live';
import type {
	SyncShapeToTableOptions,
	SyncShapeToTableResult
} from '@electric-sql/pglite-sync';
import * as schema from './schema';

export type DB = PGliteInterface & {
	orm: PgliteDatabase<typeof schema>;
} & {
	vector: unknown;
	electric: {
		initMetadataTables: () => Promise<void>;
		syncShapeToTable: (
			options: SyncShapeToTableOptions
		) => Promise<SyncShapeToTableResult>;
	};
	live: LiveNamespace;
};
