import { useNavigate } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useMeasure } from 'react-use';
import { PanelLeft, Plus } from 'lucide-react';
import { Button } from '@quanta/ui/button';
import { SidebarFooter } from '@quanta/web/components/sidebar-footer';
import { SidebarPinnedList } from '@quanta/web/components/sidebar-pinned-list';
import { createItemFn } from '@quanta/web/lib/item-fns';

interface SidebarProps {
  toggleSidebar: () => void;
}

export function Sidebar({ toggleSidebar }: SidebarProps) {
  const navigate = useNavigate();
  const [ref, { width }] = useMeasure<HTMLDivElement>();
  const createItem = useServerFn(createItemFn);
  const isCollapsed = width < 40;

  return (
    <div className="flex h-full w-full flex-col" ref={ref}>
      <div
        className={`flex items-center gap-2 ${
          isCollapsed ? 'flex-col' : 'flex-row justify-between'
        }`}
      >
        <Button
          className="text-muted-foreground size-10"
          variant="ghost"
          onClick={toggleSidebar}
        >
          <PanelLeft className="size-6!" />
        </Button>

        <Button
          className="text-muted-foreground size-10"
          variant="ghost"
          onClick={async () => {
            const item = await createItem({ data: { name: '', content: '' } });
            if (item) {
              navigate({ to: '/$itemId', params: { itemId: item.id } });
            }
          }}
        >
          <Plus className="size-6!" />
        </Button>
      </div>

      <div className="flex flex-col gap-2 py-10">
        {/* <Button
          className={`text-muted-foreground size-10 px-1.5! ${!collapsed && 'w-full justify-start'}`}
          variant="ghost"
        >
          <Hash className="size-6!" />
          {!collapsed && 'Tags'}
        </Button>

        <Button
          className={`text-muted-foreground size-10 px-1.5! ${!collapsed && 'w-full justify-start'}`}
          variant="ghost"
        >
          <Brain className="size-6!" />
          {!collapsed && 'Tasks'}
        </Button>

        <Button
          className={`text-muted-foreground size-10 px-1.5! ${!collapsed && 'w-full justify-start'}`}
          variant="ghost"
        >
          <Plug className="size-6!" />
          {!collapsed && 'Tools'}
        </Button> */}
      </div>

      <SidebarPinnedList isCollapsed={isCollapsed} />

      <SidebarFooter isCollapsed={isCollapsed} />
    </div>
  );
}
