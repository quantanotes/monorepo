import { integer, varchar } from 'drizzle-orm/pg-core';
import { nanoidCol, nanoidPk, nanoIdColRef, timestamps } from './utils';

export const pinnedColumns = (
  space?: any,
  user?: any,
  item?: any,
  tag?: any,
) => ({
  id: nanoidPk(12),
  userId: nanoIdColRef(user || null),
  spaceId: nanoIdColRef(space || null),
  itemId: item
    ? nanoidCol(12).references(() => item.id, {
        onDelete: 'cascade',
      })
    : nanoidCol(12),
  tagId: tag
    ? nanoidCol(12).references(() => tag.id, {
        onDelete: 'cascade',
      })
    : nanoidCol(12),
  order: integer().notNull().default(0),
  type: varchar({ length: 8 }).notNull(),
  ...timestamps,
});
