import { pgTable, text, varchar } from 'drizzle-orm/pg-core';

export const actions = pgTable('actions', {
  name: varchar({ length: 255 }).primaryKey(),
  code: text().notNull(),
  executable: text().notNull(),
});
