import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { hc } from 'hono/client';
import { ai_controller } from './controllers/ai';
import { registry_controller } from './controllers/registry';

const app = new Hono()
  .use(cors())
  .route('/ai', ai_controller)
  .route('/registry', registry_controller);

export type App = typeof app;

export const client = hc<typeof app>('http://localhost:4000');

export default {
  port: 4000,
  fetch: app.fetch,
};
