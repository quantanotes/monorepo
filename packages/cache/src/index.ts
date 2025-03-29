import { createClient } from 'redis';
export const cache = createClient({
  url: process.env.CACHE_URL,
  pingInterval: 1000,
});
await cache.connect();
