import { useRef } from 'react';
import { useMeasure } from 'react-use';
import type { ImperativePanelHandle } from 'react-resizable-panels';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@quanta/ui/resizable';
import { Sidebar } from '@quanta/web/components/sidebar';
import { RightPanel } from '@quanta/web/components/right-panel';

export function MainLayout({ children }: React.PropsWithChildren) {
  const [measureRef, { width: containerWidth }] = useMeasure<HTMLDivElement>();
  const sidebarRef = useRef<ImperativePanelHandle>(null);

  function getRelativeWidth(width: number) {
    if (!containerWidth) return 0;
    const availableWidth = containerWidth - 16 - 8;
    return (width / availableWidth) * 100;
  }

  function toggleSidebar() {
    if (sidebarRef.current?.isExpanded()) {
      sidebarRef.current?.resize(getRelativeWidth(40));
    } else {
      sidebarRef.current?.resize(getRelativeWidth(256));
    }
  }

  return (
    <div ref={measureRef} className="h-screen">
      <ResizablePanelGroup
        className="bg-muted/25 h-screen p-2"
        direction="horizontal"
      >
        <ResizablePanel
          ref={sidebarRef}
          className="h-full"
          defaultSize={getRelativeWidth(256)}
          minSize={getRelativeWidth(40)}
          maxSize={getRelativeWidth(320)}
          collapsedSize={getRelativeWidth(40)}
          collapsible
        >
          <Sidebar toggleSidebar={toggleSidebar} />
        </ResizablePanel>
        <ResizableHandle className="w-2 bg-transparent" />
        <ResizablePanel className="relative flex h-full flex-col">
          {children}
        </ResizablePanel>
        <ResizableHandle className="w-2 bg-transparent" />
        <ResizablePanel className="relative z-50 flex h-[calc(100vh-16px)] flex-col overflow-visible">
          <RightPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
