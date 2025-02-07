import { timestamp, varchar } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

export const timestamps = {
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
};

export const nanoidCol = () => varchar({ length: 21 });

export const nanoidPk = () =>
  nanoidCol()
    .$defaultFn(() => nanoid())
    .primaryKey();
