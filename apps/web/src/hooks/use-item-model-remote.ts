import { useEffect, useMemo } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { useShape } from '@electric-sql/react';
import { snakeToCamelObject } from '@quanta/utils/snake-to-camel';
import {
  getItemsFn,
  createItemFn,
  updateItemFn,
  deleteItemFn,
  searchItemFn,
} from '@quanta/web/lib/item-fns';
import type { TagQuery } from '@quanta/types';

export function useItemModelRemote() {
  const _getItemsFn = useServerFn(getItemsFn);
  const _createItemFn = useServerFn(createItemFn);
  const _updateItemFn = useServerFn(updateItemFn);
  const _deleteItemFn = useServerFn(deleteItemFn);
  const _searchItemFn = useServerFn(searchItemFn);

  const useItemLive = (id: string) => {
    const itemShape = useShape({
      url: `${process.env.PUBLIC_APP_URL}/api/db/item/${id}`,
    });
    return useMemo(
      () => snakeToCamelObject(itemShape.data.at(0)!),
      [itemShape],
    );
  };

  const useItemsLive = (ids: string[]) => {
    const itemsShape = useShape({
      url: `${process.env.PUBLIC_APP_URL}/api/db/items`,
      params: {
        where: ids.map((id) => `id = ${id}`).join(' OR '),
      },
    });
    return useMemo(() => snakeToCamelObject(itemsShape.data), [itemsShape]);
  };

  const getItems = (ids: string[]) => _getItemsFn({ data: { ids } });

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
    useItemsLive,
    getItems,
    createItem,
    updateItem,
    deleteItem,
    searchItems,
  };
}
