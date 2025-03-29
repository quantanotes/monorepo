import { desc, eq, and, or, isNotNull, ne } from '@quanta/db/drizzle';
import { type DB as DBLocal } from '@quanta/db/local';
import { type DB as DBRemote, schema } from '@quanta/db/remote';
import { sql } from '@quanta/db/drizzle';

export class PinnedModelShared {
  readonly #db: DBLocal['orm'] | DBRemote;
  readonly #spaceId: string | null;
  readonly #userId: string | null;

  constructor(
    db: DBLocal['orm'] | DBRemote,
    spaceId: string | null,
    userId: string | null,
  ) {
    this.#db = db;
    this.#spaceId = spaceId;
    this.#userId = userId;
  }

  async getAll() {
    return await this.#db
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
          END
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
          this.#spaceId
            ? eq(schema.pinned.spaceId, this.#spaceId)
            : eq(schema.pinned.userId, this.#userId!),
          or(
            and(eq(schema.pinned.type, 'item'), isNotNull(schema.items.id)),
            and(eq(schema.pinned.type, 'tag'), isNotNull(schema.tags.id)),
          ),
        ),
      )
      .orderBy(desc(schema.pinned.order));
  }

  async togglePinItem(itemId: string) {
    if (await this.isItemPinned(itemId)) {
      console.log('item was already pinned');
      await this.unpinItem(itemId);
    } else {
      console.log('item was not pinned');
      await this.pinItem(itemId);
    }
  }

  async isItemPinned(itemId: string) {
    const existing = await this.#db
      .select()
      .from(schema.pinned)
      .where(eq(schema.pinned.itemId, itemId))
      .limit(1);
    return existing.length > 0;
  }

  async pinItem(itemId: string) {
    const order = await this.#db
      .select({ order: schema.pinned.order })
      .from(schema.pinned)
      .where(
        this.#spaceId
          ? eq(schema.pinned.spaceId, this.#spaceId)
          : eq(schema.pinned.userId, this.#userId!),
      )
      .orderBy(desc(schema.pinned.order))
      .limit(1)
      .then((result) => (result.length > 0 ? result[0].order + 1 : 0));
    await this.#db
      .insert(schema.pinned)
      .values({
        itemId: itemId,
        spaceId: this.#spaceId || undefined,
        userId: this.#userId || undefined,
        type: 'item',
        order,
      })
      .onConflictDoNothing();
  }

  // Assumes an item can only be pinned in it's respective space
  async unpinItem(id: string) {
    await this.#db.delete(schema.pinned).where(eq(schema.pinned.itemId, id));
  }
}
