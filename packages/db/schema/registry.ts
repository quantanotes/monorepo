import { nanoid } from 'nanoid';
import {
  boolean,
  pgTable,
  primaryKey,
  text,
  varchar,
  vector,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const actions = pgTable(
  'actions',
  {
    name: varchar({ length: 255 }).notNull(),
    revision: varchar({ length: 4 }).$defaultFn(() => nanoid(4)),
    code: text().notNull(),
    description: text().notNull(),
    compiled: text().notNull(),
    bundled: text().notNull(),
    canonical: boolean().generatedAlwaysAs(sql`revision = ''`),
    embedding: vector({ dimensions: 768 }),
  },
  (t) => [primaryKey({ columns: [t.name, t.revision] })],
);
