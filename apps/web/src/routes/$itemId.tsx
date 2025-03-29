import { createFileRoute } from '@tanstack/react-router';
import { debounce } from '@quanta/utils/debounce';
import { useAuthUser } from '@quanta/web/lib/user';
import { updateItemWhereUserFn } from '@quanta/web/lib/item-fns';
import { itemQueryOptions } from '@quanta/web/lib/item-query';
import { useLikeModel } from '@quanta/web/hooks/use-like-model';
import { ItemPage } from '@quanta/web/components/item-page';
import { PageLayout } from '@quanta/web/components/page-layout';
import { usePinned } from '@quanta/web/contexts/pinned';
import { useItemShape } from '@quanta/web/hooks/use-item-shape';

export const Route = createFileRoute('/$itemId')({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(itemQueryOptions(params.itemId));
  },
});

function RouteComponent() {
  const { itemId } = Route.useParams();
  const user = useAuthUser();
  const item = useItemShape(itemId)!;
  const { isItemPinned, togglePinItem } = usePinned();
  const { isLiked, toggleLike } = useLikeModel(itemId);
  const isAuthor = user?.id === item?.authorId;

  const updateItemDebounced = debounce(
    (name: string, content: string) =>
      updateItemWhereUserFn({
        data: { id: itemId, name, content },
      }),
    100,
  );

  const handleUpdate = isAuthor ? updateItemDebounced : () => {};
  const handleDelete = () => {};
  const handleTogglePin = () => togglePinItem(itemId);
  const handleToggleLike = () => toggleLike();

  if (!item) {
    return <PageLayout />;
  }

  return (
    <ItemPage
      item={item}
      isAuthor={isAuthor}
      isPinned={isItemPinned(itemId)}
      isLiked={isLiked}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onTogglePin={handleTogglePin}
      onToggleLike={handleToggleLike}
    />
  );
}
