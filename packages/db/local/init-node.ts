import { drizzle } from 'drizzle-orm/pglite';
import { PGlite, MemoryFS } from '@electric-sql/pglite'
// import { live } from '@electric-sql/pglite/live'
 import { electricSync } from '@electric-sql/pglite-sync'
import { DB } from './type';

export async function init_db(_path: string) {
  const db = await PGlite.create({
    fs: new MemoryFS(),
    extensions: {
      electric: electricSync(),
    },
  }) as unknown as DB;

  await db.exec(`
    CREATE TABLE actions(
      name VARCHAR(255) PRIMARY KEY,
      code TEXT NOT NULL,
      executable TEXT NOT NULL
    );  
  `);

  await db.electric.syncShapeToTable({
    shape: {
      url: 'https://quanta-electric-dev.fly.dev/v1/shape',
      params: {
        table: 'actions',
      },
    },
    table: 'actions',
    primaryKey: ['name'],
  });

  const orm = drizzle({
	  client: db as unknown as PGlite,
	  casing: 'snake_case',
	  logger: true,
	});

  Object.defineProperty(db, 'orm', {
    value: orm,
    writable: false,
  });

  return db;
}
