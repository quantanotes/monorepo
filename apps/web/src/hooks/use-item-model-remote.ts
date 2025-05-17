import { useMemo } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { useShape } from '@electric-sql/react';
import { TagQuery } from '@quanta/types';
import { snakeToCamlObject } from '@quanta/utils/snake-to-camel';
import {
  createItemFn,
  updateItemFn,
  deleteItemFn,
  searchItemFn,
} from '@quanta/web/lib/item-fns';

export function useItemModelRemote() {
  const _createItemFn = useServerFn(createItemFn);
  const _updateItemFn = useServerFn(updateItemFn);
  const _deleteItemFn = useServerFn(deleteItemFn);
  const _searchItemFn = useServerFn(searchItemFn);

  const useItemLive = (id: string) => {
    const itemShape = useShape({
      url: `${process.env.PUBLIC_APP_URL}/api/db/item/${id}`,
    });
    return useMemo(() => snakeToCamlObject(itemShape.data.at(0)!), [itemShape]);
  };

  const createItem = (data: { name: string; content: string }) =>
    _createItemFn({ data });

  const updateItem = (id: string, data: { name: string; content: string }) =>
    _updateItemFn({ data: { id, ...data } });

  const deleteItem = (id: string) => _deleteItemFn({ data: { id } });

  const searchItems = (
    query: string,
    tags: TagQuery[] = [],
    limit: number = 10,
    offset: number = 0,
  ) => _searchItemFn({ data: { query, tags, limit, offset } });

  return {
    useItemLive,
    createItem,
    updateItem,
    deleteItem,
    searchItems,
  };
}
