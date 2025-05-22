import type { betterAuth } from 'better-auth';
import { cache } from '@quanta/cache';

export const sessionStore = {
  get: async (key: string) => {
    const value = await cache.get(key);
    return typeof value === 'string' ? value : null;
  },
  set: async (key: string, value: unknown, ttl?: number) => {
    if (ttl) {
      await cache.set(key, value, { ex: ttl });
    } else {
      await cache.set(key, value);
    }
  },
  delete: async (key: string) => {
    await cache.del(key);
  },
} satisfies Parameters<typeof betterAuth>[0]['secondaryStorage'];
