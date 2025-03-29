import type { PgTable } from 'drizzle-orm/pg-core';
import * as schema from './schema';

type TableDefinition = {
  table: string;
  schemaName: string;
  primaryKeys: string[];
  schema: PgTable;
  // jsonColumns: string[];
};

export const tables: TableDefinition[] = [
  {
    table: 'items',
    schemaName: 'items',
    primaryKeys: ['id'],
    schema: schema.items,
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
    // jsonColumns: ['value'],
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
