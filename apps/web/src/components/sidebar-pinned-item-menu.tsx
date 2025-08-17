import { MoreHorizontal } from 'lucide-react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { SidebarMenuAction } from '@quanta/ui/sidebar';
import { useItemModel } from '@quanta/web/contexts/item-model';
import { usePinned } from '@quanta/web/contexts/pinned';
import { ItemPageMenu } from '@quanta/web/components/item-page-menu';
import type { Pinned } from '@quanta/types';

interface SidebarPinnedItemMenuProps {
  pinned: Pinned;
}

export function SidebarPinnedItemMenu({ pinned }: SidebarPinnedItemMenuProps) {
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
    deleteItem(pinned.itemId!);
  };

  return (
    <ItemPageMenu
      itemId={pinned.itemId!}
      isPinned={true}
      onTogglePin={() => togglePinItem(pinned.itemId!)}
      onDelete={onDeleteItem}
      trigger={
        <SidebarMenuAction>
          <MoreHorizontal className="size-4" />
        </SidebarMenuAction>
      }
    />
  );
}
