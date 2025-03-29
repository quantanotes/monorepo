import { sql } from 'drizzle-orm';
import {
  index,
  text,
  jsonb,
  boolean,
  pgTable,
  primaryKey,
  unique,
  type ExtraConfigColumn,
} from 'drizzle-orm/pg-core';
import {
  itemColumns,
  taskColumns,
  toolColumns,
  tagColumns,
  itemTagColumns,
  pinnedColumns,
  tagTagColumns,
} from '../shared';

export const syncColumns = {
  isNew: boolean().notNull().default(false),
  isDeleted: boolean().notNull().default(false),
  isSent: boolean().notNull().default(false),
  isSynced: boolean().generatedAlwaysAs(
    sql`ARRAY_LENGTH(modified_columns, 1) IS NULL AND NOT is_deleted AND NOT is_new`,
  ),
  modifiedColumns: text().array().default([]),
  backup: jsonb(),
};

export const syncIndexes = (t: any) => [
  index().on(t.isNew),
  index().on(t.isDeleted),
  index().on(t.isSynced),
];

const table = <N extends string, C extends Record<string, any>>(
  name: N,
  columns: C,
  indexes: (t: any) => any[] = (t: {
    [Key in keyof (C & typeof syncColumns)]: ExtraConfigColumn;
  }) => [],
) =>
  pgTable<N, C & typeof syncColumns>(
    name,
    {
      ...columns,
      ...syncColumns,
    },
    (t) => [...syncIndexes(t), ...indexes(t)],
  );

export { tagTypeEnum } from '../shared';
export const items = table('items', itemColumns());
export const tags = table('tags', tagColumns(), (t: any) => [
  unique().on(t.spaceId, t.name),
]);
export const itemTags = table(
  'item_tags',
  itemTagColumns(null, items, tags),
  (t: any) => [primaryKey({ columns: [t.itemId, t.tagId] })],
);
export const tagTags = table(
  'tag_tags',
  tagTagColumns(null, tags),
  (t: any) => [primaryKey({ columns: [t.tagId, t.parentId] })],
);
export const tasks = table('tasks', taskColumns());
export const tools = table('tools', toolColumns());
export const pinned = table(
  'pinned',
  pinnedColumns(null, null, items, tags),
  (t: any) => [unique().on(t.itemId), unique().on(t.tagId)],
);
