import { PGlite } from '@electric-sql/pglite';
import { vector } from '@electric-sql/pglite/vector';
import { worker } from '@electric-sql/pglite/worker';
import { drizzle } from 'drizzle-orm/pglite';
import { PgDialect } from 'drizzle-orm/pg-core';
import migrations from '../migrations/export.json';
import * as schema from '../schema';
import type { PgSession } from 'drizzle-orm/pg-core';
import type { PGliteWorkerOptions } from '@electric-sql/pglite/worker';

worker({
  async init(options: PGliteWorkerOptions) {
    const db = await PGlite.create({
      relaxedDurability: true,
      dataDir: options.dataDir,
      fs: options.fs,
      extensions: {
        vector,
      },
      debug: options.debug,
    });

    db.exec('CREATE EXTENSION vector');

    const orm = drizzle(db, { schema });

    await new PgDialect().migrate(
      migrations,
      orm._.session as unknown as PgSession,
      'quanta',
    );

    await db.waitReady;

    return db;
  },
});
