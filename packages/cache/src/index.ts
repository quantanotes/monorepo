import { Redis } from '@upstash/redis'

export const cache = new Redis({
  url: process.env.CACHE_URL,
  token: process.env.CACHE_TOKEN,
})
