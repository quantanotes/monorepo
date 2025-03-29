import type { betterAuth } from 'better-auth';
import { cache } from '@quanta/cache';

export const sessionStore = {
  get: async (key) => {
    const value = await cache.get(key);
    return value ? value : null;
  },
  set: async (key, value, ttl) => {
    if (ttl) await cache.set(key, value, { EX: ttl });
    else await cache.set(key, value);
  },
  delete: async (key) => {
    await cache.del(key);
  },
} satisfies Parameters<typeof betterAuth>[0]['secondaryStorage'];
