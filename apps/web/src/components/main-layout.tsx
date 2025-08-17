import { useEffect, useRef, useState } from 'react';
import { useLocation } from '@tanstack/react-router';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@quanta/ui/resizable';
import { SidebarInset, SidebarProvider } from '@quanta/ui/sidebar';
import { Sidebar } from '@quanta/web/components/sidebar';
import { RightPanel } from '@quanta/web/components/right-panel';
import { Search } from '@quanta/web/components/search';
import { useMeasure } from '@quanta/web/hooks/use-measure';
import type { ImperativePanelHandle } from 'react-resizable-panels';

export function MainLayout({ children }: React.PropsWithChildren) {
  const location = useLocation();
  const sidebarRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);
  const [measureRef, { width }] = useMeasure<HTMLDivElement>();
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    setShowSearch(false);
  }, [location.pathname]);

  const getRelativeWidth = (widthPx: number) => {
    if (!width) {
      return 0;
    }
    const availableWidth = width - 16 - 8;
    return (widthPx / availableWidth) * 100;
  };

  const toggleRightPanel = () => {
    if (rightPanelRef.current?.isExpanded()) {
      rightPanelRef.current?.resize(0);
    } else {
      rightPanelRef.current?.resize(getRelativeWidth(432));
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <SidebarProvider>
      <Sidebar
        toggleRightPanel={toggleRightPanel}
        toggleSearch={toggleSearch}
      />
      <SidebarInset ref={measureRef} className="h-screen">
        <ResizablePanelGroup className="h-screen" direction="horizontal">
          <ResizablePanel className="relative flex h-full flex-col">
            {children}
          </ResizablePanel>

          <ResizableHandle className="z-50" />

          <ResizablePanel
            ref={rightPanelRef}
            className="relativeh z-50 flex h-full flex-col"
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
