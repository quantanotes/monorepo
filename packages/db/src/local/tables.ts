import * as schema from './schema';
import type { PgTable } from 'drizzle-orm/pg-core';

export type TableDefinition = {
  table: string;
  schemaName: string;
  primaryKeys: string[];
  schema: PgTable;
  columns?: string[];
  jsonColumns?: string[];
};

export const tables: TableDefinition[] = [
  {
    table: 'items',
    schemaName: 'items',
    primaryKeys: ['id'],
    schema: schema.items,
    columns: [
      'id',
      'space_id',
      'author_id',
      'name',
      'content',
      'order',
      'embedding',
      'is_embedded',
      'is_public',
      'created_at',
      'updated_at',
    ],
  },
  {
    table: 'tags',
    schemaName: 'tags',
    primaryKeys: ['id'],
    schema: schema.tags,
  },
  {
    table: 'item_tags',
    schemaName: 'itemTags',
    primaryKeys: ['item_id', 'tag_id'],
    schema: schema.itemTags,
    jsonColumns: ['value'],
  },
  {
    table: 'tag_tags',
    schemaName: 'tagTags',
    primaryKeys: ['tag_id', 'parent_id'],
    schema: schema.tagTags,
  },
  {
    table: 'pinned',
    schemaName: 'pinned',
    primaryKeys: ['id'],
    schema: schema.pinned,
  },
  {
    table: 'tasks',
    schemaName: 'tasks',
    primaryKeys: ['id'],
    schema: schema.tasks,
  },
  {
    table: 'tools',
    schemaName: 'tools',
    primaryKeys: ['id'],
    schema: schema.tools,
  },
];
