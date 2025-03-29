import { pgTable, text, unique } from 'drizzle-orm/pg-core';
import { nanoidCol, nanoidPk, timestamps } from '../../shared';
import { users } from './users';
import { items, tags } from './space';
import { spaces } from './tenant';

export const comments = pgTable('comments', {
  id: nanoidPk(),
  content: text().notNull(),
  userId: nanoidCol()
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  spaceId: nanoidCol().references(() => spaces.id, { onDelete: 'cascade' }),
  itemId: nanoidCol().references(() => items.id, { onDelete: 'cascade' }),
  tagId: nanoidCol().references(() => tags.id, { onDelete: 'cascade' }),
  ...timestamps,
});

export const likes = pgTable(
  'likes',
  {
    id: nanoidPk(),
    userId: nanoidCol()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    spaceId: nanoidCol().references(() => spaces.id, { onDelete: 'cascade' }),
    itemId: nanoidCol().references(() => items.id, { onDelete: 'cascade' }),
    tagId: nanoidCol().references(() => tags.id, { onDelete: 'cascade' }),
    ...timestamps,
  },
  (t) => [
    unique().on(t.userId, t.spaceId),
    unique().on(t.userId, t.itemId),
    unique().on(t.userId, t.tagId),
  ],
);
