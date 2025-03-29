import {
  pgTable,
  varchar,
  boolean,
  integer,
  unique,
  timestamp,
} from 'drizzle-orm/pg-core';
import { faker } from '@faker-js/faker';
import { nanoidPk } from '../../shared';

export const users = pgTable(
  'users',
  {
    id: nanoidPk(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    emailVerified: boolean().notNull(),
    image: varchar({ length: 255 }),
    username: varchar({ length: 255 })
      .$defaultFn(() => `${faker.word.adjective()}-${faker.word.noun()}`)
      .notNull(),
    discriminator: integer()
      .$defaultFn(() => faker.number.int({ min: 1000, max: 9999 }))
      .notNull(),
    updatedAt: timestamp().notNull(),
    createdAt: timestamp().notNull(),
  },
  (t) => [unique().on(t.username, t.discriminator)],
);
