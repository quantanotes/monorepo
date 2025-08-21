import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@quanta/ui/resizable';
import { SidebarInset, SidebarProvider } from '@quanta/ui/sidebar';
import { LayoutProvider, useLayout } from '@quanta/web/contexts/layout';
import { Sidebar } from '@quanta/web/components/sidebar';
import { RightPanel } from '@quanta/web/components/right-panel';
import { Search } from '@quanta/web/components/search';

export function MainLayout({ children }: React.PropsWithChildren) {
  return (
    <LayoutProvider>
      <LayoutContent>{children}</LayoutContent>
    </LayoutProvider>
  );
}

function LayoutContent({ children }: React.PropsWithChildren) {
  const {
    rightPanelRef,
    showSearch,
    setShowSearch,
    toggleRightPanel,
    toggleSearch,
    getRelativeWidth,
  } = useLayout();

  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset className="h-screen">
        <ResizablePanelGroup className="h-screen" direction="horizontal">
          <ResizablePanel className="relative flex h-full flex-col">
            {children}
          </ResizablePanel>

          <ResizableHandle className="bg-transparent" />

          <ResizablePanel
            ref={rightPanelRef}
            className="bg-sidebar/50 flex h-full flex-col"
            minSize={getRelativeWidth(336)}
            maxSize={getRelativeWidth(768)}
            collapsedSize={0}
            collapsible
          >
            <RightPanel />
          </ResizablePanel>
        </ResizablePanelGroup>

        <Search show={showSearch} setShow={setShowSearch} />
      </SidebarInset>
    </SidebarProvider>
  );
}
