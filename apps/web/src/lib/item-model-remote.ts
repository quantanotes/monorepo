import { eq, and, sql, isNull, inArray } from '@quanta/db/drizzle';
import { db, DB, schema } from '@quanta/db/remote';
import { TagQuery } from '@quanta/types';
import {
  flattenItemTagResult,
  flattenItemTagResults,
  makeTagFilter,
} from '@quanta/web/lib/items';

export class ItemModelRemote {
  readonly #db: DB;
  readonly #userId: string;

  constructor(userId: string) {
    this.#db = db;
    this.#userId = userId;
  }

  async getMany(ids: string[]) {
    return await this.#db
      .select({
        item: schema.items,
        tags: sql<any>`
          jsonb_agg(
            CASE WHEN tags.id IS NOT NULL THEN
              jsonb_build_object(
                'id', tags.id,
                'name', tags.name,
                'color', tags.color,
                'type', tags.type,
                'value', item_tags.value,
                'tagType', item_tags.type
              )
            ELSE NULL END
          )
        `,
        username: schema.users.username,
      })
      .from(schema.items)
      .groupBy(schema.items.id, schema.users.username)
      .leftJoin(schema.users, eq(schema.items.authorId, schema.users.id))
      .leftJoin(schema.itemTags, eq(schema.items.id, schema.itemTags.itemId))
      .leftJoin(schema.tags, eq(schema.itemTags.tagId, schema.tags.id))
      .where(and(inArray(schema.items.id, ids), isNull(schema.items.spaceId)))
      .then((items) => items.map(flattenItemTagResult));
  }

  async get(id: string) {
    return await this.#db
      .select({
        item: schema.items,
        tags: sql<any>`
          jsonb_agg(
            CASE WHEN tags.id IS NOT NULL THEN
              jsonb_build_object(
                'id', tags.id,
                'name', tags.name,
                'color', tags.color,
                'type', tags.type,
                'value', item_tags.value,
                'tagType', item_tags.type
              )
            ELSE NULL END
          )
        `,
        username: schema.users.username,
      })
      .from(schema.items)
      .groupBy(schema.items.id, schema.users.username)
      .leftJoin(schema.users, eq(schema.items.authorId, schema.users.id))
      .leftJoin(schema.itemTags, eq(schema.items.id, schema.itemTags.itemId))
      .leftJoin(schema.tags, eq(schema.itemTags.tagId, schema.tags.id))
      .where(and(eq(schema.items.id, id), isNull(schema.items.spaceId)))
      .then((items) => {
        const item = items.at(0);
        if (item) {
          return flattenItemTagResult(item);
        }
      });
  }

  async create({ name, content }: { name: string; content: string }) {
    return await this.#db
      .insert(schema.items)
      .values({
        name,
        content,
        authorId: this.#userId,
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
      })
      .where(
        and(eq(schema.items.id, id), eq(schema.items.authorId, this.#userId)),
      )
      .returning()
      .then((items) => items.at(0));
  }

  async delete(id: string) {
    return await this.#db
      .delete(schema.items)
      .where(
        and(eq(schema.items.id, id), eq(schema.items.authorId, this.#userId)),
      )
      .returning()
      .then((items) => items.at(0));
  }

  async search(
    query: string,
    tags: TagQuery[],
    limit: number = 10,
    offset: number = 0,
  ) {
    const withTags = tags.length > 0;
    const withTextSearch = query.trim().length > 0;
    const textSimilarityColumn = {
      text_similarity: sql<number>`
        ts_rank_cd(
          setweight(to_tsvector('english', ${schema.items.name}), 'A') ||
          setweight(to_tsvector('english', ${schema.items.content}), 'B'),
          plainto_tsquery('english', ${query})
        ) AS text_similarity
      `,
    };
    return await this.#db
      .select({
        item: schema.items,
        tags: sql<any>`
        jsonb_agg(
          CASE WHEN tags.id IS NOT NULL THEN
            jsonb_build_object(
              'id', tags.id,
              'name', tags.name,
              'color', tags.color,
              'type', tags.type,
              'value', item_tags.value,
              'tagType', item_tags.type
            )
          ELSE NULL END
        )
      `,
        username: schema.users.username,
        ...(withTextSearch && textSimilarityColumn),
      })
      .from(schema.items)
      .leftJoin(schema.users, eq(schema.items.authorId, schema.users.id))
      .leftJoin(schema.itemTags, eq(schema.items.id, schema.itemTags.itemId))
      .leftJoin(schema.tags, eq(schema.itemTags.tagId, schema.tags.id))
      .where(
        and(
          isNull(schema.items.spaceId),
          withTags ? makeTagFilter(tags) : undefined,
        ),
      )
      .groupBy(schema.items.id, schema.users.username)
      .orderBy(
        withTextSearch
          ? sql`text_similarity DESC`
          : sql`${schema.items.updatedAt} DESC`,
      )
      .limit(limit)
      .offset(offset)
      .then((results) => flattenItemTagResults(results));
  }
}
