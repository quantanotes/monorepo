import { Plugin } from 'rollup';
import { eq } from 'drizzle-orm';
import { schema } from '#/db/local';

export function db_resolver(db: any) {
  return {
    name: 'db-resolver',

    resolveId(source) {
      if (source.startsWith('#')) {
        return source;
      }
      return null;
    },

    async load(source) {
      if (!source.startsWith('#')) {
        return;
      }

      const results = await db 
        .select({
          executable: schema.actions.executable
        })
        .from(schema.actions)
        .where(eq(schema.actions.name, source.slice(1)))

      return results[0].executable;
    },
  } satisfies Plugin; 
}
