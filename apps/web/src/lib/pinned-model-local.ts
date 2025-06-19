import { desc, eq, and, or, isNotNull, sql } from '@quanta/db/drizzle';
import { schema } from '@quanta/db/local';
import type { DB } from '@quanta/db/local';

export class PinnedModelLocal {
  readonly #db: DB['orm'];
  readonly #spaceId: string;

  constructor(db: DB['orm'], spaceId: string) {
    this.#db = db;
    this.#spaceId = spaceId;
  }

  async getAll() {
    return await this.getAllQuery();
  }

  async togglePinItem(itemId: string) {
    if (await this.isItemPinned(itemId)) {
      await this.unpinItem(itemId);
    } else {
      await this.pinItem(itemId);
    }
  }

  async togglePinTag(tagId: string) {
    if (await this.isTagPinned(tagId)) {
      await this.unpinTag(tagId);
    } else {
      await this.pinTag(tagId);
    }
  }

  async isItemPinned(itemId: string) {
    const existing = await this.#db
      .select()
      .from(schema.pinned)
      .where(
        and(
          eq(schema.pinned.itemId, itemId),
          eq(schema.pinned.isDeleted, false),
        ),
      )
      .limit(1);
    return existing.length > 0;
  }

  async isTagPinned(tagId: string) {
    const existing = await this.#db
      .select()
      .from(schema.pinned)
      .where(
        and(eq(schema.pinned.tagId, tagId), eq(schema.pinned.isDeleted, false)),
      )
      .limit(1);
    return existing.length > 0;
  }

  async pinItem(itemId: string) {
    const order = await this.#getNextPinOrder();
    await this.#db
      .insert(schema.pinned)
      .values({
        itemId,
        spaceId: this.#spaceId || undefined,
        type: 'item',
        order,
      })
      .onConflictDoNothing();
  }

  async pinTag(tagId: string) {
    const order = await this.#getNextPinOrder();
    await this.#db
      .insert(schema.pinned)
      .values({
        tagId,
        spaceId: this.#spaceId,
        type: 'tag',
        order,
      })
      .onConflictDoNothing();
  }

  async unpinItem(id: string) {
    await this.#db.delete(schema.pinned).where(eq(schema.pinned.itemId, id));
  }

  async unpinTag(id: string) {
    await this.#db.delete(schema.pinned).where(eq(schema.pinned.tagId, id));
  }

  getAllQuery() {
    return this.#db
      .select({
        id: schema.pinned.id,
        itemId: schema.pinned.itemId,
        tagId: schema.pinned.tagId,
        type: schema.pinned.type,
        name: sql<string>`
          CASE
            WHEN ${schema.pinned.type} = 'item' THEN ${schema.items.name}
            WHEN ${schema.pinned.type} = 'tag' THEN ${schema.tags.name}
            ELSE ''
          END AS name
        `,
      })
      .from(schema.pinned)
      .leftJoin(
        schema.items,
        and(
          eq(schema.pinned.type, 'item'),
          eq(schema.pinned.itemId, schema.items.id),
        ),
      )
      .leftJoin(
        schema.tags,
        and(
          eq(schema.pinned.type, 'tag'),
          eq(schema.pinned.tagId, schema.tags.id),
        ),
      )
      .where(
        and(
          eq(schema.pinned.spaceId, this.#spaceId),
          eq(schema.pinned.isDeleted, false),
          or(
            and(eq(schema.pinned.type, 'item'), isNotNull(schema.items.id)),
            and(eq(schema.pinned.type, 'tag'), isNotNull(schema.tags.id)),
          ),
        ),
      )
      .orderBy(desc(schema.pinned.order));
  }

  async #getNextPinOrder() {
    return await this.#db
      .select({ order: schema.pinned.order })
      .from(schema.pinned)
      .where(
        and(
          eq(schema.pinned.spaceId, this.#spaceId),
          eq(schema.pinned.isDeleted, false),
        ),
      )
      .orderBy(desc(schema.pinned.order))
      .limit(1)
      .then((result) => (result.length > 0 ? result[0].order + 1 : 0));
  }
}
