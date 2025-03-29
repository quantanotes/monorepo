import { queryOptions } from '@tanstack/react-query';
import { isItemLikedFn } from '@quanta/web/lib/like-fns';

export const likeItemQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['like', 'item', id],
    queryFn: () => isItemLikedFn({ data: { id } }),
  });
