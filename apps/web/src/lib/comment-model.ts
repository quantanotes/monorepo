import { and, eq, desc } from '@quanta/db/drizzle';
import { type DB, schema } from '@quanta/db/remote';
import { eqMaybeNull } from '@quanta/utils/eq-maybe-null';

export class CommendModel {
  readonly #db: DB;
  readonly #spaceId: string | null;
  readonly #userId: string;

  constructor(db: DB, spaceId: string | null, userId: string) {
    this.#db = db;
    this.#spaceId = spaceId;
    this.#userId = userId;
  }

  async add(content: string, itemId?: string) {
    await this.#db
      .insert(schema.comments)
      .values({
        content,
        userId: this.#userId,
        itemId,
        spaceId: this.#spaceId,
      })
      .returning();
  }

  async delete(id: string) {
    await this.#db
      .delete(schema.comments)
      .where(
        and(
          eq(schema.comments.id, id),
          eq(schema.comments.userId, this.#userId),
        ),
      );
  }

  async getWhereItem(id: string) {
    return await this.#db
      .select()
      .from(schema.comments)
      .where(eq(schema.comments.itemId, id))
      .orderBy(desc(schema.comments.createdAt));
  }

  async getWhereSpace() {
    return await this.#db
      .select()
      .from(schema.comments)
      .where(eqMaybeNull(schema.comments.spaceId, this.#spaceId))
      .orderBy(desc(schema.comments.createdAt));
  }
}
