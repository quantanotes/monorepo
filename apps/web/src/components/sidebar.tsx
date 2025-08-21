import {
  Sidebar as BaseSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@quanta/ui/sidebar';
import { SidebarProfileMenu } from '@quanta/web/components/sidebar-profile-menu';
import { SidebarSpaceMenu } from '@quanta/web/components/sidebar-space-menu';
import { SidebarMainNavigation } from '@quanta/web/components/sidebar-main-navigation';
import { SidebarPinnedList } from '@quanta/web/components/sidebar-pinned-list';
import { QuickMenu } from '@quanta/web/components/quick-menu';
import { cn } from '@quanta/ui/utils/css';

export function Sidebar() {
  const { state } = useSidebar();

  return (
    <BaseSidebar className="border-r-0">
      <SidebarHeader
        className={cn('mb-4', state !== 'hovering' && 'flex w-full flex-row')}
      >
        <SidebarSpaceMenu />
        {state === 'hovering' ? <div /> : <QuickMenu />}
      </SidebarHeader>

      <SidebarContent>
        <SidebarMainNavigation />
        <SidebarPinnedList />
      </SidebarContent>

      <SidebarFooter>
        <SidebarProfileMenu />
      </SidebarFooter>
    </BaseSidebar>
  );
}
