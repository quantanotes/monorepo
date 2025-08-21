import { useNavigate } from '@tanstack/react-router';
import { SearchIcon, MessageCircleIcon, SquarePenIcon } from 'lucide-react';
import { Button } from '@quanta/ui/button';
import { SidebarTrigger } from '@quanta/ui/sidebar';
import { useSpace } from '@quanta/web/hooks/use-space';
import { useItemModel } from '@quanta/web/contexts/item-model';
import { useLayout } from '@quanta/web/contexts/layout';

export function QuickMenu() {
  const navigate = useNavigate();
  const space = useSpace();
  const itemModel = useItemModel();
  const { toggleSearch, toggleRightPanel } = useLayout();

  const handleCreateItem = async () => {
    const item = await itemModel?.createItem({ name: '', content: '' });
    if (item && space) {
      navigate({
        to: '/s/$spaceId/$itemId',
        params: { spaceId: space.id, itemId: item.id },
      });
    } else if (item) {
      navigate({ to: '/$itemId', params: { itemId: item.id } });
    }
  };

  return (
    <div className="flex gap-1">
      <div className="grow">
        <SidebarTrigger />
      </div>

      <Button
        className="size-7"
        variant="ghost"
        size="icon"
        onClick={handleCreateItem}
      >
        <SquarePenIcon />
      </Button>

      <Button
        className="size-7"
        variant="ghost"
        size="icon"
        onClick={toggleRightPanel}
      >
        <MessageCircleIcon />
      </Button>

      <Button
        className="size-7"
        variant="ghost"
        size="icon"
        onClick={toggleSearch}
      >
        <SearchIcon />
      </Button>
    </div>
  );
}
