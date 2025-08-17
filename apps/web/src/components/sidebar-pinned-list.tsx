import { ChevronRightIcon, PinIcon } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from '@quanta/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@quanta/ui/collapsible';
import { useSpace } from '@quanta/web/hooks/use-space';
import { usePinned } from '@quanta/web/contexts/pinned';
import { SidebarPinned } from '@quanta/web/components/sidebar-pinned';

export function SidebarPinnedList() {
  const { pinned } = usePinned()!;
  const { state } = useSidebar();
  const space = useSpace();

  if (state == 'collapsed') {
    return null;
  }

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full text-sm">
            <PinIcon className="mr-2 size-4" />
            Pinned
            <ChevronRightIcon className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>

        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {pinned.length === 0 ? (
                <SidebarMenuItem>
                  <div className="text-muted-foreground p-4 text-center text-xs">
                    Nothing pinned yet
                  </div>
                </SidebarMenuItem>
              ) : (
                pinned.map((p) => (
                  <SidebarMenuItem key={p.id}>
                    <SidebarPinned pinned={p} spaceId={space?.id} />
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
