import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { nanoidCol, nanoidPk } from '@quanta/db/shared';
import { users } from './users';

export const sessions = pgTable('sessions', {
  id: nanoidPk(),
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
  id: nanoidPk(),
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
  id: nanoidPk(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp(),
  updatedAt: timestamp(),
});
