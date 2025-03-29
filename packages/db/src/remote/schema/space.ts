import { pgTable, unique, primaryKey, integer } from 'drizzle-orm/pg-core';
import { users } from './users';
import { spaces } from './tenant';
import {
  tagColumns,
  itemTagColumns,
  tagTagColumns,
  taskColumns,
  toolColumns,
  itemColumns,
  pinnedColumns,
} from '../../shared';

export { tagTypeEnum } from '../../shared';

export const items = pgTable('items', {
  ...itemColumns(spaces, users),
  likeCount: integer().notNull().default(0),
  pinCount: integer().notNull().default(0),
  commentCount: integer().notNull().default(0),
});

export const tags = pgTable('tags', tagColumns(spaces), (t) => [
  unique().on(t.spaceId, t.name),
]);

export const objectTags = pgTable(
  'item_tags',
  itemTagColumns(spaces, items, tags),
  (t) => [primaryKey({ columns: [t.itemId, t.tagId] })],
);

export const tagTags = pgTable('tag_tags', tagTagColumns(spaces, tags));

export const tasks = pgTable('tasks', taskColumns(spaces));

export const tools = pgTable('tools', toolColumns(spaces));

export const pinned = pgTable(
  'pinned',
  pinnedColumns(spaces, users, items, tags),
  (t) => [
    unique().on(t.userId, t.itemId),
    unique().on(t.userId, t.tagId),
    unique().on(t.spaceId, t.itemId),
    unique().on(t.spaceId, t.tagId),
  ],
);
