import { useNavigate, createFileRoute } from '@tanstack/react-router';
import { debounce } from '@quanta/utils/debounce';
import { preloadShapeFn } from '@quanta/web/lib/preload-shape-fn';
import { usePinned } from '@quanta/web/contexts/pinned';
import { useItemModelRemote } from '@quanta/web/hooks/use-item-model-remote';
import { useAuthUser } from '@quanta/web/hooks/use-auth-user';
import { useLike } from '@quanta/web/hooks/use-like';
import { ItemPage } from '@quanta/web/components/item-page';
import type { Item } from '@quanta/types';

export const Route = createFileRoute('/$itemId')({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    await preloadShapeFn({
      url: `${process.env.PUBLIC_APP_URL}/api/db/item/${params.itemId}`,
    });
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const { itemId } = Route.useParams();
  const { useItemLive, updateItem, deleteItem } = useItemModelRemote()!;
  const { isItemPinned, togglePinItem } = usePinned()!;
  const { isLiked, toggleLike } = useLike(itemId);
  const user = useAuthUser();
  const item = useItemLive(itemId) as Item;
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
