import { useNavigate } from '@tanstack/react-router';
import { debounce } from '@quanta/utils/debounce';
import { usePinned } from '@quanta/web/contexts/pinned';
import { useItemModel } from '@quanta/web/contexts/item-model';
import { useAuthUser } from '@quanta/web/hooks/use-auth-user';
import { itemQueryOptions } from '@quanta/web/lib/item-query';
import { useLike } from '@quanta/web/hooks/use-like';
import { ItemPage } from '@quanta/web/components/item-page';

export const Route = createFileRoute({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(itemQueryOptions(params.itemId));
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const { itemId } = Route.useParams();
  const { useItemLive, updateItem, deleteItem } = useItemModel()!;
  const { isItemPinned, togglePinItem } = usePinned()!;
  const { isLiked, toggleLike } = useLike(itemId);
  const user = useAuthUser();
  const item = useItemLive(itemId);
  const isAuthor = user?.id === item?.authorId;

  const handleUpdate = isAuthor
    ? debounce((name: string, content: string) => {
        updateItem(itemId, { name, content });
      }, 500)
    : undefined;

  const handleDelete = isAuthor
    ? () => {
        deleteItem(itemId);
        navigate({ to: '/', params: {} });
      }
    : undefined;

  const handleTogglePin = () => togglePinItem(itemId);

  const handleToggleLike = () => toggleLike();

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
