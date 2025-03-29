import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { toggleLikeItemFn } from '@quanta/web/lib/like-fns';
import { likeItemQueryOptions } from '@quanta/web/lib/like-query';

export function useLikeModel(itemId: string) {
  const queryClient = useQueryClient();
  const toggleLikeItem = useServerFn(toggleLikeItemFn);
  const likeItemQuery = useQuery(likeItemQueryOptions(itemId));

  const mutation = useMutation({
    mutationFn: () => toggleLikeItem({ data: { id: itemId } }),
    onMutate: async () => {
      const previous = queryClient.getQueryData(['like', 'item', itemId]);
      queryClient.setQueryData(['like', 'item', itemId], (old) => !old);
      return { previous };
    },
    onError: (_e, _v, context) => {
      queryClient.setQueryData(['like', 'item', itemId], context!.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries(likeItemQueryOptions(itemId));
    },
  });

  return {
    isLiked: likeItemQuery.data || false,
    toggleLike: mutation.mutate,
  };
}
