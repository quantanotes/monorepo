import { queryOptions } from '@tanstack/react-query';
import { getItemFn, searchItemFn } from '@quanta/web/lib/item-fns';

export const itemsQueryOptions = (params: {
  query?: string;
  tags?: { name: string; operator?: string; value?: string }[];
  limit?: number;
  offset?: number;
}) =>
  queryOptions({
    queryKey: ['items', params],
    queryFn: () => searchItemFn({ data: params }),
  });

export const itemQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['items', id],
    queryFn: () => getItemFn({ data: { id } }),
  });
