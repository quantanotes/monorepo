import { TagQuery, TagType } from '@quanta/types';
import { ItemModelLocal } from '@quanta/web/lib/item-model-local';
import { useDB } from '@quanta/web/contexts/db';
import { useAuthUser } from '@quanta/web/hooks/use-auth-user';
import { useSpace } from '@quanta/web/hooks/use-space';

export function useItemModelLocal() {
  const space = useSpace();
  const user = useAuthUser();
  const db = useDB();

  if (!space || !user || !db) {
    return;
  }

  const model = new ItemModelLocal(db, user.id, space.id);

  const useItemLive = (id: string) => model.useItemLive(id);

  const useSearchItemsLive = (
    query: string,
    tags: TagQuery[] = [],
    limit: number = 10,
    offset: number = 0,
  ) => model.useSearchLive(query, tags, limit, offset);

  const getItems = (ids: string[]) => model.getMany(ids);

  const createItem = (data: { name: string; content: string }) =>
    model.create(data);

  const updateItem = (id: string, data: { name: string; content: string }) =>
    model.update(id, data);

  const deleteItem = (id: string) => model.delete(id);

  const tagItem = (id: string, tag: string, value: any, type: TagType) =>
    model.tag(id, tag, value, type);

  const untagItem = (id: string, tag: string) => model.untag(id, tag);

  const searchItems = (
    query: string,
    tags: TagQuery[] = [],
    limit: number = 10,
    offset: number = 0,
  ) => model.search(query, tags, limit, offset);

  return {
    useItemLive,
    useSearchItemsLive,
    getItems,
    createItem,
    updateItem,
    deleteItem,
    tagItem,
    untagItem,
    searchItems,
  };
}
