import pick from 'lodash/pick';
import type { TagType } from '@quanta/types';
import { doc } from '@quanta/agent';
import { ItemModelLocal } from '@quanta/web/lib/item-model-local';

export const db = (itemModel: ItemModelLocal) => {
  const filterItem = (item: any) => {
    if (!item) return null;
    return pick(item, ['id', 'name', 'content', 'tags']);
  };

  const filterItems = (items: any[]) => {
    if (!items) return [];
    return items.map(filterItem);
  };

  return {
    __doc__:
      'Knowledge base operations for managing items and their relationships through tags.',

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
  };
};
