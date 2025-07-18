import { useEffect, useRef, useState } from 'react';
import { useLocation } from '@tanstack/react-router';
import type { ImperativePanelHandle } from 'react-resizable-panels';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@quanta/ui/resizable';
import { useMeasure } from '@quanta/web/hooks/use-measure';
import { Sidebar } from '@quanta/web/components/sidebar';
import { RightPanel } from '@quanta/web/components/right-panel';
import { Search } from '@quanta/web/components/search';

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

  const toggleSidebar = () => {
    if (sidebarRef.current?.isExpanded()) {
      sidebarRef.current?.resize(getRelativeWidth(48));
    } else {
      sidebarRef.current?.resize(getRelativeWidth(256));
    }
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
    <div ref={measureRef} className="h-screen">
      <ResizablePanelGroup className="h-screen" direction="horizontal">
        <ResizablePanel
          ref={sidebarRef}
          className="h-full transition-transform"
          defaultSize={getRelativeWidth(256)}
          minSize={getRelativeWidth(48)}
          maxSize={getRelativeWidth(320)}
          collapsedSize={getRelativeWidth(48)}
          collapsible
        >
          <Sidebar
            toggleSidebar={toggleSidebar}
            toggleRightPanel={toggleRightPanel}
            toggleSearch={toggleSearch}
          />
        </ResizablePanel>

        <ResizableHandle className="bg-transparent" />

        <ResizablePanel className="relative flex h-full flex-col">
          {children}
        </ResizablePanel>

        <ResizableHandle className="bg-transparent" />

        <ResizablePanel
          ref={rightPanelRef}
          className="bg-card/20 relative z-50 flex h-full flex-col"
          minSize={getRelativeWidth(336)}
          maxSize={getRelativeWidth(768)}
          collapsedSize={0}
          collapsible
        >
          <RightPanel />
        </ResizablePanel>
      </ResizablePanelGroup>

      <Search show={showSearch} setShow={setShowSearch} />
    </div>
  );
}
