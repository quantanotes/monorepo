import { Hono } from 'hono';
import { compile } from '#/compile';
import { db, schema } from '#/db/remote';

export const registry_controller = new Hono()
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