import { eq } from 'drizzle-orm';
import { Plugin } from 'rollup';
import { schema } from '#/db/local';

export function db_resolver(db: any) {
  return {
    name: 'db-resolver',

    resolveId: {
      order: 'post',
      async handler() {
        return null;
      },
    },

    async load(source) {
      // Really hacky, not how you are supposed to do it but but works for now
      if (source.includes('node_modules') || source.includes('monorepo')) {
        return null;
      }
      const results = await db
        .select({
          executable: schema.actions.compiled,
        })
        .from(schema.actions)
        .where(eq(schema.actions.name, source));
      return results[0]?.executable ?? null;
    },
  } satisfies Plugin;
}
