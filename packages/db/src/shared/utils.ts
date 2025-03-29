import { timestamp, varchar } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

export const nanoidCol = (length = 12) => varchar({ length });
export const nanoidPk = (length = 12) =>
  nanoidCol(length)
    .$defaultFn(() => nanoid(length))
    .primaryKey();
export const nanoIdColRef = (table: any, length = 12) =>
  table
    ? nanoidCol(length).references(() => table.id, { onDelete: 'cascade' })
    : nanoidCol(length);

export const timestamps = {
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
};
