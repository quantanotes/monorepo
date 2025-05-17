import { useNavigate, Link } from '@tanstack/react-router';
import {
  Brain,
  Hash,
  MessageCircle,
  PanelLeft,
  Plug,
  Plus,
  Search,
} from 'lucide-react';
import { Button } from '@quanta/ui/button';
import { useItemModel } from '@quanta/web/contexts/item-model';
import { useSpace } from '@quanta/web/hooks/use-space';
import { useMeasure } from '@quanta/web/hooks/use-measure';
import { SidebarFooter } from '@quanta/web/components/sidebar-footer';
import { SidebarPinnedList } from '@quanta/web/components/sidebar-pinned-list';

interface SidebarProps {
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  toggleSearch: () => void;
}

export function Sidebar({
  toggleSidebar,
  toggleRightPanel,
  toggleSearch,
}: SidebarProps) {
  const navigate = useNavigate();
  const itemModel = useItemModel();
  const space = useSpace();
  const [ref, { width }] = useMeasure<HTMLDivElement>();
  const isCollapsed = width <= 56;

  const handleCreateItem = async () => {
    const item = await itemModel?.createItem({ name: '', content: '' });
    if (item) {
      if (space) {
        navigate({
          to: '/s/$spaceId/$itemId',
          params: { spaceId: space.id, itemId: item.id },
        });
      } else {
        navigate({ to: '/$itemId', params: { itemId: item.id } });
      }
    }
  };

  return (
    <div className="bg-card/25 flex h-full w-full flex-col p-1" ref={ref}>
      <div
        className={`flex items-center gap-2 ${
          isCollapsed ? 'flex-col' : 'flex-row justify-between'
        }`}
      >
        <Button
          className="text-muted-foreground size-8"
          variant="ghost"
          onClick={toggleSidebar}
        >
          <PanelLeft className="size-6!" />
        </Button>

        <div
          className={`flex items-center gap-2 ${
            isCollapsed ? 'flex-reverse flex-col' : 'flex-row'
          }`}
        >
          <Button
            className="text-muted-foreground size-8"
            variant="ghost"
            onClick={toggleRightPanel}
          >
            <MessageCircle className="size-6!" />
          </Button>

          <Button
            className="text-muted-foreground size-8"
            variant="ghost"
            onClick={toggleSearch}
          >
            <Search className="size-6!" />
          </Button>

          <Button
            className="text-muted-foreground size-8"
            variant="ghost"
            onClick={handleCreateItem}
          >
            <Plus className="size-6!" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 py-10">
        <Button
          className={`text-muted-foreground size-8 ${!isCollapsed && 'w-full justify-start'} text-base`}
          variant="ghost"
          asChild
        >
          <Link
            href={space ? '/s/$spaceId/tags' : '/tags'}
            params={{ spaceId: space?.id }}
          >
            <Hash className="size-6!" />
            {!isCollapsed && 'Tags'}
          </Link>
        </Button>

        <Button
          className={`text-muted-foreground size-8 ${!isCollapsed && 'w-full justify-start'} text-base`}
          variant="ghost"
        >
          <Brain className="size-6!" />
          {!isCollapsed && 'Tasks'}
        </Button>

        <Button
          className={`text-muted-foreground size-8 ${!isCollapsed && 'w-full justify-start'} text-base`}
          variant="ghost"
        >
          <Plug className="size-6!" />
          {!isCollapsed && 'Tools'}
        </Button>
      </div>

      <SidebarPinnedList isCollapsed={isCollapsed} />

      <SidebarFooter isCollapsed={isCollapsed} />
    </div>
  );
}
