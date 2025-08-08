import { useNavigate } from '@tanstack/react-router';
import {
  Brain,
  Hash,
  Home,
  MessageCircle,
  PanelLeft,
  Plug,
  Search,
  SquarePen,
} from 'lucide-react';
import { cn } from '@quanta/ui/utils/css';
import { useItemModel } from '@quanta/web/contexts/item-model';
import { useSpace } from '@quanta/web/hooks/use-space';
import { useMeasure } from '@quanta/web/hooks/use-measure';
import { SidebarFooter } from '@quanta/web/components/sidebar-footer';
import { SidebarPinnedList } from '@quanta/web/components/sidebar-pinned-list';
import { SidebarButton } from '@quanta/web/components/sidebar-button';
import { SidebarLink } from '@quanta/web/components/sidebar-link';

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
  const isCollapsed = width <= 64;

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
    <div
      className={cn(
        'bg-muted flex h-full w-full flex-col px-2 py-3',
        isCollapsed && 'items-center',
      )}
      ref={ref}
    >
      <div
        className={cn(
          'flex items-center gap-2',
          isCollapsed ? 'flex-col' : 'flex-row justify-between px-2',
        )}
      >
        <SidebarButton
          icon={<PanelLeft className="size-6!" />}
          variant="icon"
          isCollapsed={isCollapsed}
          onClick={toggleSidebar}
        />

        <div
          className={cn(
            'flex items-center gap-2',
            isCollapsed ? 'flex-reverse flex-col' : 'flex-row',
          )}
        >
          <SidebarButton
            icon={<MessageCircle className="size-6!" />}
            variant="icon"
            onClick={toggleRightPanel}
            isCollapsed={isCollapsed}
          />

          <SidebarButton
            icon={<Search className="size-6!" />}
            variant="icon"
            isCollapsed={isCollapsed}
            onClick={toggleSearch}
          />

          <SidebarButton
            icon={<SquarePen className="size-6!" />}
            variant="icon"
            isCollapsed={isCollapsed}
            onClick={handleCreateItem}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 py-8">
        <SidebarLink
          href={space ? '/s/$spaceId' : '/'}
          params={{ spaceId: space?.id! }}
          icon={<Home className="size-6!" />}
          label="Home"
          isCollapsed={isCollapsed}
        />

        {space && (
          <>
            <SidebarLink
              href="/s/$spaceId/tags"
              params={{ spaceId: space.id }}
              icon={<Hash className="size-6!" />}
              label="Tags"
              isCollapsed={isCollapsed}
            />

            <SidebarButton
              icon={<Brain className="size-6!" />}
              label="Tasks"
              isCollapsed={isCollapsed}
            />

            <SidebarButton
              icon={<Plug className="size-6!" />}
              label="Tools"
              isCollapsed={isCollapsed}
            />
          </>
        )}
      </div>

      <SidebarPinnedList isCollapsed={isCollapsed} />

      <SidebarFooter isCollapsed={isCollapsed} />
    </div>
  );
}
