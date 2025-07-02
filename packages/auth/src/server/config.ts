import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
// import {
//   polar,
//   checkout,
//   portal,
//   usage,
//   webhooks,
// } from '@polar-sh/better-auth';
// import { Polar } from '@polar-sh/sdk';
import { db, schema } from '@quanta/db/remote';
import { sessionStore } from './session-store';

// const polarClient = new Polar({
//   accessToken: process.env.POLAR_TOKEN,
// });

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
    database: {
      generateId: false,
    },
  },

  plugins: [
    // polar({
    //   client: polarClient,
    //   createCustomerOnSignUp: true,
    //   use: [
    //     checkout({
    //       products: [
    //         {
    //           productId: '9b74e6ca-f46d-489f-82e3-542fb0922637',
    //           slug: 'Starter',
    //         },
    //       ],
    //       successUrl: process.env.POLAR_SUCCESS_URL,
    //       authenticatedUsersOnly: true,
    //     }),
    //   ],
    // }),
  ],
} satisfies Parameters<typeof betterAuth>[0];
