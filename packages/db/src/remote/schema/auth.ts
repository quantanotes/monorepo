import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { users } from './users';
import { nanoidCol } from '@quanta/db/shared';

export const sessions = pgTable('sessions', {
  id: uuid().defaultRandom().primaryKey(),
  expiresAt: timestamp().notNull(),
  token: text().notNull().unique(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
  ipAddress: text(),
  userAgent: text(),
  userId: nanoidCol()
    .notNull()
    .references(() => users.id),
});

export const accounts = pgTable('accounts', {
  id: uuid().defaultRandom().primaryKey(),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: nanoidCol()
    .notNull()
    .references(() => users.id),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: timestamp(),
  refreshTokenExpiresAt: timestamp(),
  scope: text(),
  password: text(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
});

export const verifications = pgTable('verifications', {
  id: uuid().defaultRandom().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp(),
  updatedAt: timestamp(),
});

export const jwks = pgTable('jwks', {
  id: varchar({ length: 21 })
    .$defaultFn(() => nanoid())
    .primaryKey(),
  publicKey: text(),
  privateKey: text(),
  createdAt: timestamp(),
});
