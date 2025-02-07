import { Hono } from 'hono';
import { bundle, compile } from '#/compiler';
import { db, schema } from '#/db/remote';

export const registry_controller = new Hono().post('/push', async (c) => {
  const { name, code } = await c.req.json<{ name: string; code: string }>();
  const compiled = compile(code);
  await db.insert(schema.actions).values({
    name,
    code,
    compiled,
    bundled: await bundle(null, compiled),
    description: '',
  });
  return c.json({}, 200);
});
