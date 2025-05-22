import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db, schema } from '@quanta/db/remote';
import { sessionStore } from './session-store';

export default {
  secret: process.env.AUTH_SECRET,
  baseURL: process.env.PUBLIC_APP_URL,
  basePath: '/api/auth',

  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    schema,
  }),

  secondaryStorage: sessionStore,

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  advanced: {
    generateId: false,
    database: {
      generateId: false,
    },
  },
} satisfies Parameters<typeof betterAuth>[0];
