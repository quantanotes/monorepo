import { Hono } from 'hono';
import { hc } from 'hono/client';
import { compile } from '#/compile';
import { db, schema } from '#/db/remote';

const app = new Hono()
  .post('/push', async (c) => {
    const  { name, code } = await c.req.json<{ name: string; code: string }>();
    const executable = compile(code);
    await db.insert(schema.actions).values({
      name,
      code,
      executable,
    }).onConflictDoUpdate({
      target: schema.actions.name, 
      set: { code, executable },
    });
    return c.json({}, 200);
  });

export const client = hc<typeof app>('http://localhost:4000');

export default {
  port: 4000,
  fetch: app.fetch,
};
