import {
  Sidebar as BaseSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@quanta/ui/sidebar';
import { SidebarProfileMenu } from '@quanta/web/components/sidebar-profile-menu';
import { SidebarSpaceMenu } from '@quanta/web/components/sidebar-space-menu';
import { SidebarMainNavigation } from '@quanta/web/components/sidebar-main-navigation';
import { SidebarPinnedList } from '@quanta/web/components/sidebar-pinned-list';

interface SidebarProps {
  toggleRightPanel: () => void;
  toggleSearch: () => void;
}

export function Sidebar({ toggleRightPanel, toggleSearch }: SidebarProps) {
  return (
    <BaseSidebar className="border-r-0" collapsible="icon">
      <SidebarHeader>
        <SidebarSpaceMenu />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMainNavigation
          toggleSearch={toggleSearch}
          toggleRightPanel={toggleRightPanel}
        />
        <SidebarPinnedList />
      </SidebarContent>
      <SidebarFooter>
        <SidebarProfileMenu />
      </SidebarFooter>
    </BaseSidebar>
  );
}
