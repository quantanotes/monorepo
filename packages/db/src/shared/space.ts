import {
  text,
  jsonb,
  boolean,
  vector,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { nanoidCol, nanoidPk, nanoIdColRef, timestamps } from './utils';

export const tagTypes = [
  'text',
  'number',
  'boolean',
  'reference',
  'date',
  'datetime',
  'duration',
  'url',
] as const;

export const tagTypeEnum = pgEnum('tag_types', tagTypes);

export const itemColumns = (space: any = null, user: any = null) => ({
  id: nanoidPk(),
  spaceId: nanoIdColRef(space),
  authorId: nanoIdColRef(user).notNull(),
  name: text().notNull(),
  content: text().notNull(),
  order: integer().notNull().default(0),
  embedding: vector({ dimensions: 1536 }),
  isEmbedded: boolean().notNull().default(false),
  isPublic: boolean().notNull().default(false),
  ...timestamps,
});

export const tagColumns = (space?: any) => ({
  id: nanoidPk(),
  spaceId: nanoIdColRef(space),
  name: text().notNull(),
  order: integer().notNull().default(0),
  color: text(),
  type: tagTypeEnum(),
  default: jsonb(),
  ...timestamps,
});

export const itemTagColumns = (space: any, item: any, tag: any) => ({
  spaceId: nanoIdColRef(space),
  itemId: nanoidCol()
    .notNull()
    .references(() => item.id, {
      onDelete: 'cascade',
    }),
  tagId: nanoidCol()
    .notNull()
    .references(() => tag.id, {
      onDelete: 'cascade',
    }),
  value: jsonb(),
  type: tagTypeEnum(),
  ...timestamps,
});

export const tagTagColumns = (space?: any, tag?: any) => ({
  spaceId: nanoIdColRef(space),
  tagId: nanoidCol()
    .notNull()
    .references(() => tag.id, { onDelete: 'cascade' }),
  parentId: nanoidCol()
    .notNull()
    .references(() => tag.id, { onDelete: 'cascade' }),
  order: integer().notNull().default(0),
  ...timestamps,
});
