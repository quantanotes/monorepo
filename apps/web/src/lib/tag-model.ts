import { and, eq } from '@quanta/db/drizzle';
import { DB as DBLocal } from '@quanta/db/local';
import { db as dbRemote, schema } from '@quanta/db/remote';

export class TagModelShared {
  readonly #db: DBLocal['orm'] | typeof dbRemote;
  readonly #spaceId: string;
  readonly #userId: string;

  constructor(
    db: DBLocal['orm'] | typeof dbRemote,
    spaceId: string,
    userId: string,
  ) {
    this.#db = db;
    this.#spaceId = spaceId;
    this.#userId = userId;
  }

  async getById(id: string) {
    return this.#db
      .select()
      .from(schema.tags)
      .where(
        and(eq(schema.tags.spaceId, this.#spaceId), eq(schema.tags.id, id)),
      )
      .then((tags) => tags.at(0));
  }

  async getByName(name: string) {
    return this.#db
      .select()
      .from(schema.tags)
      .where(
        and(eq(schema.tags.spaceId, this.#spaceId), eq(schema.tags.name, name)),
      )
      .then((tags) => tags.at(0));
  }
}
