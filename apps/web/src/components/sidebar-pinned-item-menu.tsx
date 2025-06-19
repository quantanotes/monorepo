import { useParams, useNavigate } from '@tanstack/react-router';
import { useItemModel } from '@quanta/web/contexts/item-model';
import { usePinned } from '@quanta/web/contexts/pinned';
import { ItemPageMenu } from '@quanta/web/components/item-page-menu';
import type { Pinned } from '@quanta/types';

interface SidebarPinnedProps {
  pinned: Pinned;
}

export function SidebarPinnedItemMenu({ pinned }: SidebarPinnedProps) {
  const navigate = useNavigate();
  const { itemId: pageItemId, spaceId: pageSpaceId } = useParams({
    strict: false,
  });
  const { togglePinItem } = usePinned()!;
  const { deleteItem } = useItemModel()!;
  const itemId = pinned?.itemId!;

  const onDeleteItem = () => {
    if (pageItemId === itemId && pageSpaceId) {
      navigate({ to: '/s/$spaceId', params: { spaceId: pageSpaceId } });
    } else if (pageItemId === itemId) {
      navigate({ to: '/' });
    }
    deleteItem(itemId);
  };

  const onTogglePinItem = () => {
    togglePinItem(itemId);
  };

  return (
    <ItemPageMenu
      className="peer-hover/menu-button:text-accent-foreground absolute right-1 size-8 opacity-0 transition-opacity group-hover/menu-item:opacity-100"
      itemId={itemId}
      onTogglePin={onTogglePinItem}
      onDelete={onDeleteItem}
      isPinned={true}
    />
  );
}
