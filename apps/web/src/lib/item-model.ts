import { and, eq, isNull, or, ilike } from '@quanta/db/drizzle';
import { type DB as DBLocal } from '@quanta/db/local';
import { type DB, schema } from '@quanta/db/remote';

function eqMaybeNull(col: any, value: any) {
  return value ? eq(col, value) : isNull(col);
}

export class ItemModelShared {
  readonly #db: DBLocal['orm'] | DB;
  readonly #spaceId: string | null;
  readonly #userId: string;

  constructor(db: DBLocal['orm'] | DB, spaceId: string | null, userId: string) {
    this.#db = db;
    this.#spaceId = spaceId;
    this.#userId = userId;
  }

  async get(id: string) {
    return await this.#db
      .select({
        ...schema.items,
        username: schema.users.username,
      })
      .from(schema.items)
      .leftJoin(schema.users, eq(schema.items.authorId, schema.users.id))
      .where(
        and(
          eq(schema.items.id, id),
          eqMaybeNull(schema.items.spaceId, this.#spaceId),
        ),
      )
      .then((items) => items.at(0));
  }

  async create({ name, content }: { name: string; content: string }) {
    return await this.#db
      .insert(schema.items)
      .values({
        name,
        content,
        authorId: this.#userId,
        spaceId: this.#spaceId,
      })
      .returning()
      .then((items) => items.at(0));
  }

  async update(
    id: string,
    { name, content }: { name: string; content: string },
  ) {
    await this.#db
      .update(schema.items)
      .set({
        name,
        content,
        authorId: this.#userId,
        spaceId: this.#spaceId,
      })
      .where(
        and(
          eq(schema.items.id, id),
          eqMaybeNull(schema.items.spaceId, this.#spaceId),
        ),
      )
      .returning()
      .then((items) => items.at(0));
  }

  async updateWhereUser(
    id: string,
    { name, content }: { name: string; content: string },
  ) {
    await this.#db
      .update(schema.items)
      .set({
        name,
        content,
        authorId: this.#userId,
        spaceId: this.#spaceId,
      })
      .where(
        and(
          eq(schema.items.id, id),
          eq(schema.items.authorId, this.#userId),
          eqMaybeNull(schema.items.spaceId, this.#spaceId),
        ),
      )
      .returning()
      .then((items) => items.at(0));
  }

  async deleteItemWhereUser(id: string) {
    return await this.#db
      .delete(schema.items)
      .where(
        and(
          eq(schema.items.id, id),
          eq(schema.items.authorId, this.#userId),
          eqMaybeNull(schema.items.spaceId, this.#spaceId),
        ),
      )
      .returning()
      .then((items) => items.at(0));
  }

  async textSearchItemsWithTags(
    query: string,
    tags: {} = {},
    limit: number = 10,
    offset: number = 0,
  ) {
    return await this.#db
      .select({
        ...schema.items,
        username: schema.users.username,
      })
      .from(schema.items)
      .leftJoin(schema.users, eq(schema.items.authorId, schema.users.id))
      .where(
        and(
          eqMaybeNull(schema.items.spaceId, this.#spaceId),
          or(
            ilike(schema.items.name, `%${query}%`),
            ilike(schema.items.content, `%${query}%`),
          ),
        ),
      )
      .orderBy(schema.items.updatedAt)
      .limit(limit)
      .offset(offset);
  }
}
