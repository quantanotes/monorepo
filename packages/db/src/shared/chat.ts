import { text, boolean } from 'drizzle-orm/pg-core';
import { nanoidPk, nanoIdColRef, timestamps } from './utils';

export const personaColumns = (space?: any, user?: any) => ({
  id: nanoidPk(),
  spaceId: nanoIdColRef(space || null),
  authorId: nanoIdColRef(user || null).notNull(),
  name: text().notNull(),
  prompt: text().notNull(),
  withAgent: boolean().notNull().default(true),
  ...timestamps,
});
