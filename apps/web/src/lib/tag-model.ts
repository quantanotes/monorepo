import { aliasedTable, and, eq } from '@quanta/db/drizzle';
import { type DB as DBLocal, schema } from '@quanta/db/local';
import type { DB as DBRemote } from '@quanta/db/remote';
import { TagType } from '@quanta/types';

export class TagModel {
  readonly #db: DBLocal['orm'] | DBRemote;
  readonly #spaceId: string;

  constructor(db: DBLocal['orm'] | DBRemote, spaceId: string) {
    this.#db = db;
    this.#spaceId = spaceId;
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

  async getOrCreate(name: string, type?: TagType) {
    const tag = await this.getByName(name);
    if (tag) {
      return tag;
    } else {
      return await this.#db
        .insert(schema.tags)
        .values({
          name,
          type,
          spaceId: this.#spaceId,
        })
        .returning()
        .then((tags) => tags.at(0)!);
    }
  }

  async getChildren(parentTagName: string) {
    const children = await this.getChildrenQuery(parentTagName);
    return children.map((child) => child.childTag);
  }

  async getAll() {
    return await this.getAllQuery();
  }

  async update(name: string, data: { name: string }) {
    await this.#db
      .update(schema.tags)
      .set({
        name: data.name,
      })
      .where(
        and(eq(schema.tags.name, name), eq(schema.tags.spaceId, this.#spaceId)),
      );
  }

  async delete(name: string) {
    await this.#db
      .delete(schema.tags)
      .where(
        and(eq(schema.tags.name, name), eq(schema.tags.spaceId, this.#spaceId)),
      );
  }

  async addChild(parentTagName: string, childTagName: string) {
    const [parentTag, childTag] = await Promise.all(
      [parentTagName, childTagName].map((name) => this.getOrCreate(name)),
    );

    const existing = await this.#db
      .select()
      .from(schema.tagTags)
      .where(
        and(
          eq(schema.tagTags.parentId, parentTag.id),
          eq(schema.tagTags.tagId, childTag.id),
        ),
      )
      .limit(1)
      .then((result) => result.at(0));

    if (existing) {
      return existing;
    }

    return await this.#db
      .insert(schema.tagTags)
      .values({
        spaceId: this.#spaceId,
        parentId: parentTag.id,
        tagId: childTag.id,
      })
      .returning()
      .then((result) => result.at(0));
  }

  async removeChild(parentTagName: string, childTagName: string) {
    await this.#db
      .delete(schema.tagTags)
      .where(
        and(
          eq(
            schema.tagTags.parentId,
            this.#db
              .select({ id: schema.tags.id })
              .from(schema.tags)
              .where(eq(schema.tags.name, parentTagName))
              .limit(1),
          ),
          eq(
            schema.tagTags.tagId,
            this.#db
              .select({ id: schema.tags.id })
              .from(schema.tags)
              .where(eq(schema.tags.name, childTagName))
              .limit(1),
          ),
        ),
      );
  }

  getByNameQuery(tagName: string) {
    return this.#db
      .select()
      .from(schema.tags)
      .where(
        and(
          eq(schema.tags.spaceId, this.#spaceId),
          eq(schema.tags.name, tagName),
        ),
      );
  }

  getAllQuery() {
    return this.#db
      .select()
      .from(schema.tags)
      .where(eq(schema.tags.spaceId, this.#spaceId));
  }

  getChildrenQuery(parentTagName: string) {
    const parentTags = aliasedTable(schema.tags, 'parent_tags');
    const childTags = aliasedTable(schema.tags, 'child_tags');
    return this.#db
      .select({
        childTag: childTags,
      })
      .from(schema.tagTags)
      .innerJoin(parentTags, eq(parentTags.id, schema.tagTags.parentId))
      .innerJoin(childTags, eq(childTags.id, schema.tagTags.tagId))
      .where(eq(parentTags.name, parentTagName));
  }
}
