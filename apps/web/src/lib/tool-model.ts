import { useLiveQuery } from '@electric-sql/pglite-react';
import { and, eq } from '@quanta/db/drizzle';
import { type DB, schema } from '@quanta/db/local';
import { snakeToCamlObject } from '@quanta/utils/snake-to-camel';

export class ToolModel {
  readonly #db: DB;
  readonly #spaceId: string;

  constructor(db: DB, spaceId: string) {
    this.#db = db;
    this.#spaceId = spaceId;
  }

  useToolsLive() {
    const { sql, params } = this.#db.orm
      .select()
      .from(schema.tools)
      .where(eq(schema.tools.spaceId, this.#spaceId))
      .toSQL();
    const tools = useLiveQuery(sql, params)?.rows || [];
    return tools.map(snakeToCamlObject);
  }

  async create(type: string) {
    return await this.#db.orm
      .insert(schema.tools)
      .values({ type, spaceId: this.#spaceId })
      .returning()
      .then((tools) => tools.at(0));
  }

  async update(id: string, config: any) {
    return await this.#db.orm
      .update(schema.tools)
      .set({ config })
      .where(
        and(eq(schema.tools.id, id), eq(schema.tools.spaceId, this.#spaceId)),
      )
      .returning()
      .then((tools) => tools.at(0));
  }

  async delete(id: string) {
    await this.#db.orm
      .delete(schema.tools)
      .where(
        and(eq(schema.tools.id, id), eq(schema.tools.spaceId, this.#spaceId)),
      );
  }
}
