import { text, jsonb } from 'drizzle-orm/pg-core';
import { nanoidPk, nanoIdColRef, timestamps } from './utils';

export const taskColumns = (space?: any, user?: any) => ({
  id: nanoidPk(),
  spaceId: nanoIdColRef(space || null),
  userId: nanoIdColRef(user || null),
  name: text().notNull(),
  description: text().notNull(),
  code: text().notNull(),
  ...timestamps,
});

export const toolColumns = (space?: any, user?: any) => ({
  id: nanoidPk(),
  spaceId: nanoIdColRef(space || null),
  userId: nanoIdColRef(user || null),
  name: text().notNull().default(''),
  type: text().notNull(),
  config: jsonb(),
  ...timestamps,
});
