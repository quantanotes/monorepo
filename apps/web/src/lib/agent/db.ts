import pick from 'lodash-es/pick';
import { doc } from '@quanta/agent';
import type { TagType } from '@quanta/types';
import type { TagModel } from '@quanta/web/lib/tag-model';
import type { ItemModelLocal } from '@quanta/web/lib/item-model-local';

export const db = (itemModel: ItemModelLocal, tagModel: TagModel) => {
  const filterItem = (item: any) => {
    if (!item) return null;
    return pick(item, ['id', 'name', 'content', 'tags']);
  };

  const filterItems = (items: any[]) => {
    if (!items) return [];
    return items.map(filterItem);
  };

  return {
    __doc__: `Knowledge Base API for managing items and their associated tags.

Items are the fundamental units of knowledge and can represent documents, contacts, projects, or any object.
Tags are metadata fields attached to items. Tags can have values (e.g., #priority: high, #due: 2024-03-20).

**Child-tags**: Tags can have child-tags to define structured information.
For example, a #contact tag can have child-tags #email, #phone, #address.
Use child-tags to create higher-order structured data on your items.
Prefer lower kebab-case for all tag names.

The user may refer to this API as their database, their notes, their documents etc.
Essentially this is the user's general knowledge/data store.
You are operating within a Notion/Anytype/Airtable style app.
`,

    get: doc(
      'db.get',
      async (id: string) => {
        const result = await itemModel.get(id);
        return filterItem(result);
      },
      `(id:string): Promise<Item|null>
Get item by ID with its tags
db.get("doc_123")`,
    ),

    create: doc(
      'db.create',
      async (data: {
        name: string;
        content: string;
        tags?: Record<string, { value?: any; type?: TagType }>;
      }) => {
        const result = await itemModel.create(data);
        return filterItem(result);
      },
      `(data:{name:string, content:string, tags?:{[name]:{ value?, type? }}}): Promise<Item>
Create item with optional tags
db.create({
  name: "Task",
  content: "Details",
  tags: { priority: { value: "high" } }
})`,
    ),

    update: doc(
      'db.update',
      async (
        id: string,
        data: {
          name: string;
          content: string;
          tags?: Record<string, { value?: any; type?: TagType }>;
        },
      ) => {
        const result = await itemModel.update(id, data);
        return filterItem(result);
      },
      `(id:string, data:{name:string, content:string, tags?}): Promise<Item>
Update item and its tags
db.update("doc_123", {
  name: "Task",
  content: "New details",
  tags: { status: "done" }
})`,
    ),

    delete: doc(
      'db.delete',
      async (id: string) => itemModel.delete(id),
      `(id:string): Promise<void>
Delete item and its tags
db.delete("doc_123")`,
    ),

    tags: doc(
      'db.tag',
      async () => tagModel.getAllQuery(),
      `(): Promise<Tag[]>
Fetch all tags in the database
db.tags()`,
    ),

    create_tag: doc(
      'db.create_tag',
      (name: string, type?: TagType) => tagModel.create(name, type),
      `(name:string, type?:TagType): Promise<Tag>
Create a new tag
db.create_tag("priority")`,
    ),

    update_tag: doc(
      'db.update_tag',
      (name: string, data: { name: string }) => tagModel.update(name, data),
      `(name:string, data:{name:string}): Promise<void>
Rename a tag
db.update_tag("old-priority", { name: "new-priority" })`,
    ),

    delete_tag: doc(
      'db.delete_tag',
      (name: string) => tagModel.delete(name),
      `(name:string): Promise<void>
Delete a tag
db.delete_tag("priority")`,
    ),

    tag: doc(
      'db.tag',
      async (id: string, name: string, value?: any, type?: TagType) =>
        itemModel.tag(id, name, value, type),
      `(id:string, name:string, value?, type?): Promise<void>
Add/update item tag
db.tag("doc_123", "priority", "high")
db.tag("doc_123", "due", "2024-03-20", "date")`,
    ),

    untag: doc(
      'db.untag',
      (id: string, name: string) => itemModel.untag(id, name),
      `(id:string, name:string): Promise<void>
Remove tag from object
db.untag("doc_123", "priority")`,
    ),

    search: doc(
      'db.search',
      async (query: string, limit?: number) => {
        if (query === '') query = 'everything';
        const results = await itemModel.search(query, [], limit);
        return filterItems(results);
      },
      `(query:string, limit?:number): Promise<object[]>
Search objects by semantic similarity
Query must not be empty or it will fail
db.semantic_search("project docs", 5)`,
    ),

    tag_tag: doc(
      `db.tag_tag`,
      (parent: string, child: string) => tagModel.addChild(parent, child),
      `(parent: string, child: string): Promise<void>
Adds a child tag to a tag.
db.tag_tag("people", "age");`,
    ),

    untag_tag: doc(
      `db.untag_tag`,
      (parent: string, child: string) => tagModel.removeChild(parent, child),
      `(parent: string, child: string): Promise<void>
Adds a child tag to a tag.
db.untag_tag("people", "age");`,
    ),
  };
};
