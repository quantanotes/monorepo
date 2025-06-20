import { useNavigate, createFileRoute } from '@tanstack/react-router';
import { debounce } from '@quanta/utils/debounce';
import { usePinned } from '@quanta/web/contexts/pinned';
import { useItemModelLocal } from '@quanta/web/hooks/use-item-model-local';
import { ItemPage } from '@quanta/web/components/item-page';
import type { Item } from '@quanta/types';

export const Route = createFileRoute('/s/$spaceId/$itemId')({
  component: RouteComponent,
  ssr: false,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { itemId, spaceId } = Route.useParams();
  const { useItemLive, updateItem, deleteItem } = useItemModelLocal()!;
  const { isItemPinned, togglePinItem } = usePinned()!;
  const item = useItemLive(itemId) as Item;

  const handleUpdate = debounce((name: string, content: string) => {
    updateItem(itemId, { name, content });
  }, 500);

  const handleDelete = () => {
    deleteItem(itemId);
    navigate({ to: '/s/$spaceId', params: { spaceId } });
  };

  const handleTogglePin = () => {
    togglePinItem(itemId);
  };

  return (
    <ItemPage
      item={item}
      isPinned={isItemPinned(itemId)}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onTogglePin={handleTogglePin}
    />
  );
}
