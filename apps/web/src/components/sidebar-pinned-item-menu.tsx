import { useParams, useNavigate } from '@tanstack/react-router';
import { Pinned } from '@quanta/types';
import { useItemModel } from '@quanta/web/contexts/item-model';
import { usePinned } from '@quanta/web/contexts/pinned';
import { ItemPageMenu } from '@quanta/web/components/item-page-menu';

interface SidebarPinnedProps {
  pinned: Pinned;
}

export function SidebarPinnedItemMenu({ pinned }: SidebarPinnedProps) {
  const navigate = useNavigate();
  const { togglePinItem } = usePinned();
  const { deleteItem } = useItemModel();
  const { itemId, spaceId } = useParams({ strict: false });

  const onDeleteItem = () => {
    if (itemId === pinned.itemId) {
      if (spaceId) {
        navigate({ to: '/s/$spaceId', params: { spaceId } });
      } else {
        navigate({ to: '/' });
      }
    }
    deleteItem(pinned.itemId);
  };

  return (
    <ItemPageMenu
      className="peer-hover/menu-button:text-accent-foreground absolute right-1 size-8 opacity-0 transition-opacity group-hover/menu-item:opacity-100"
      isPinned={true}
      onTogglePin={() => togglePinItem(pinned.itemId)}
      onDelete={onDeleteItem}
    />
  );
}
