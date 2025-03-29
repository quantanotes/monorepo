import {
  pgTable,
  pgEnum,
  varchar,
  integer,
  unique,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { faker } from '@faker-js/faker';
import { users } from './users';
import { nanoidCol, nanoidPk, timestamps } from '../../shared';

export const memberRole = pgEnum('member_role', [
  'owner',
  'admin',
  'member',
  'guest',
]);

export const spaces = pgTable(
  'spaces',
  {
    id: nanoidPk(12),
    name: varchar({ length: 255 }).notNull(),
    discriminator: integer()
      .$defaultFn(() => faker.number.int({ min: 1000, max: 9999 }))
      .notNull(),
    ...timestamps,
  },
  (t) => [unique().on(t.name, t.discriminator)],
);

export const members = pgTable(
  'members',
  {
    spaceId: nanoidCol(12)
      .notNull()
      .references(() => spaces.id, { onDelete: 'cascade' }),
    userId: nanoidCol()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: memberRole(),
    ...timestamps,
  },
  (t) => [primaryKey({ columns: [t.spaceId, t.userId] })],
);
