import { and, eq, desc } from '@quanta/db/drizzle';
import { type DB as DBLocal } from '@quanta/db/local';
import { type DB, schema } from '@quanta/db/remote';
import { eqMaybeNull } from '@quanta/utils/eq-maybe-null';

export class CommentModelShared {
  readonly #db: DBLocal['orm'] | DB;
  readonly #spaceId: string | null;
  readonly #userId: string;

  constructor(db: DBLocal['orm'] | DB, spaceId: string | null, userId: string) {
    this.#db = db;
    this.#spaceId = spaceId;
    this.#userId = userId;
  }

  async addComment(content: string, itemId?: string) {
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

  async deleteComment(commentId: string) {
    await this.#db
      .delete(schema.comments)
      .where(
        and(
          eq(schema.comments.id, commentId),
          eq(schema.comments.userId, this.#userId),
        ),
      );
  }

  async getItemComments(itemId: string) {
    return await this.#db
      .select()
      .from(schema.comments)
      .where(eq(schema.comments.itemId, itemId))
      .orderBy(desc(schema.comments.createdAt));
  }

  async getSpaceComments() {
    return await this.#db
      .select()
      .from(schema.comments)
      .where(eqMaybeNull(schema.comments.spaceId, this.#spaceId))
      .orderBy(desc(schema.comments.createdAt));
  }
}
