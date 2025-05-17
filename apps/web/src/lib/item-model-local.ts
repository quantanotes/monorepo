import { useLiveQuery } from '@electric-sql/pglite-react';
import { snakeToCamlObject } from '@quanta/utils/snake-to-camel';
import { and, eq, sql } from '@quanta/db/drizzle';
import { DB, schema } from '@quanta/db/local';
import { ItemTag, TagQuery, TagType } from '@quanta/types';
import {
  flattenItemTagResult,
  flattenItemTagResults,
  makeTagFilter,
} from '@quanta/web/lib/items';
import { TagModel } from '@quanta/web/lib/tag-model';
import { validateTagValue } from '@quanta/web/lib/tags';

interface ItemWithTags {
  item: typeof schema.items.$inferSelect;
  tags: ItemTag[];
}

export class ItemModelLocal {
  readonly #db: DB;
  readonly #spaceId: string;
  readonly #userId: string;
  readonly tagModel: TagModel;

  constructor(db: DB, userId: string, spaceId: string) {
    this.#db = db;
    this.#spaceId = spaceId;
    this.#userId = userId;
    this.tagModel = new TagModel(db.orm, spaceId);
  }

  async get(id: string) {
    const items = await this.getQuery(id);
    const item = items.at(0);
    if (item) {
      return flattenItemTagResult(item);
    }
  }

  async create({ name, content }: { name: string; content: string }) {
    return await this.#db.orm
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
    await this.#db.orm
      .update(schema.items)
      .set({
        name,
        content,
      })
      .where(
        and(eq(schema.items.id, id), eq(schema.items.spaceId, this.#spaceId)),
      )
      .returning()
      .then((items) => items.at(0));
  }

  async delete(id: string) {
    await this.#db.orm
      .delete(schema.items)
      .where(
        and(eq(schema.items.id, id), eq(schema.items.spaceId, this.#spaceId)),
      )
      .returning()
      .then((items) => items.at(0));
  }

  async search(
    query: string = '',
    tags: TagQuery[] = [],
    limit: number = 10,
    offset: number = 0,
  ) {
    const results = await this.searchQuery(query, tags, limit, offset);
    return flattenItemTagResults(results);
  }

  async tag(id: string, tagName: string, value?: any, type?: TagType) {
    const tag = await this.tagModel.getOrCreate(tagName, type);
    if (tag.type) {
      value = validateTagValue(value, tag.type);
    }
    await this.#db.orm
      .insert(schema.itemTags)
      .values({
        spaceId: this.#spaceId,
        itemId: id,
        tagId: tag.id,
        value,
        type: tag.type || type || null,
      })
      .onConflictDoUpdate({
        target: [schema.itemTags.itemId, schema.itemTags.tagId],
        set: {
          value,
          type: tag.type || type || null,
        },
      });
  }

  async untag(id: string, tagName: string) {
    const tag = this.tagModel.getByName(tagName);
    if (!tag) {
      return;
    }
    await this.#db.orm
      .delete(schema.itemTags)
      .where(
        and(
          eq(schema.itemTags.itemId, id),
          eq(schema.itemTags.tagId, tag.id),
          eq(schema.itemTags.spaceId, this.#spaceId),
        ),
      )
      .returning();
  }

  useItemLive(id: string) {
    const { sql, params } = this.getQuery(id).toSQL();
    const items = useLiveQuery(sql, params)?.rows || [];
    const item = items.at(0) as ItemWithTags | undefined;
    if (item) {
      //@ts-ignore
      item.item = snakeToCamlObject(item);
      return flattenItemTagResult(item);
    }
  }

  useSearchLive(
    query?: string,
    tags?: TagQuery[],
    limit: number = 10,
    offset: number = 0,
  ) {
    const { sql, params } = this.searchQuery(
      query,
      tags,
      limit,
      offset,
    ).toSQL();
    const items = useLiveQuery(sql, params)?.rows || [];
    return flattenItemTagResults(
      //@ts-ignore
      items.map((item) => ({ item: snakeToCamlObject(item), tags: item.tags })),
    );
  }

  getQuery(id: string) {
    return this.#db.orm
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
          ) as tags
        `,
      })
      .from(schema.items)
      .leftJoin(schema.itemTags, eq(schema.items.id, schema.itemTags.itemId))
      .leftJoin(schema.tags, eq(schema.itemTags.tagId, schema.tags.id))
      .where(
        and(
          eq(schema.items.id, id),
          eq(schema.items.spaceId, this.#spaceId),
          // eq(schema.items.isDeleted, false),
          // eq(schema.tags.isDeleted, false),
          // eq(schema.itemTags.isDeleted, false),
        ),
      )
      .groupBy(schema.items.id);
  }

  searchQuery(
    query?: string,
    tags?: TagQuery[],
    limit: number = 10,
    offset: number = 0,
  ) {
    const withTags = tags && tags.length > 0;
    const withTextSearch = query && query.trim().length > 0;
    const textSimilarityColumn = {
      text_similarity: sql<number>`
        ts_rank_cd(
          setweight(to_tsvector('english', ${schema.items.name}), 'A') ||
          setweight(to_tsvector('english', ${schema.items.content}), 'B'),
          plainto_tsquery('english', ${query})
        ) AS text_similarity
      `,
    };
    return this.#db.orm
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
          ) AS tags
        `,
        ...(withTextSearch && textSimilarityColumn),
      })
      .from(schema.items)
      .leftJoin(schema.itemTags, eq(schema.items.id, schema.itemTags.itemId))
      .leftJoin(schema.tags, eq(schema.itemTags.tagId, schema.tags.id))
      .where(
        and(
          eq(schema.items.spaceId, this.#spaceId),
          // eq(schema.items.isDeleted, false),
          // eq(schema.tags.isDeleted, false),
          // eq(schema.itemTags.isDeleted, false),
          withTags ? makeTagFilter(tags) : undefined,
        ),
      )
      .groupBy(schema.items.id)
      .orderBy(
        withTextSearch
          ? sql`text_similarity DESC`
          : sql`${schema.items.updatedAt} DESC`,
      )
      .limit(limit)
      .offset(offset);
  }
}
