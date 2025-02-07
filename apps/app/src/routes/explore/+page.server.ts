import { db, schema } from '$/server/db';

export async function load() {
  const actions = await db.select().from(schema.actions).limit(100);
  return {
    actions,
  }
}
