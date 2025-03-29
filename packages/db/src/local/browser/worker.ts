import { PGlite } from '@electric-sql/pglite';
import { vector } from '@electric-sql/pglite/vector';
import { type PGliteWorkerOptions, worker } from '@electric-sql/pglite/worker';
import { PgDialect, PgSession } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/pglite';
import migrations from '../migrations/export.json';
import * as schema from '../schema';

worker({
  async init(options: PGliteWorkerOptions) {
    const db = await PGlite.create({
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
