import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from '@tanstack/react-router';
import { useMeasure } from '@quanta/web/hooks/use-measure';
import type { ImperativePanelHandle } from 'react-resizable-panels';

interface LayoutContextType {
  rightPanelRef: React.RefObject<ImperativePanelHandle | null>;
  showSearch: boolean;
  setShowSearch: (value: boolean) => void;
  toggleRightPanel: () => void;
  toggleSearch: () => void;
  getRelativeWidth: (width: number) => number;
}

const LayoutContext = createContext<LayoutContextType>(null!);

export function LayoutProvider({ children }: React.PropsWithChildren) {
  const location = useLocation();
  const rightPanelRef = useRef<ImperativePanelHandle>(null);
  const [measureRef, { width }] = useMeasure<HTMLDivElement>();
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    setShowSearch(false);
  }, [location.pathname]);

  const getRelativeWidth = (widthPx: number) => {
    if (!width) return 0;
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

  const toggleSearch = () => setShowSearch((prev) => !prev);

  return (
    <LayoutContext.Provider
      value={{
        rightPanelRef,
        showSearch,
        setShowSearch,
        toggleRightPanel,
        toggleSearch,
        getRelativeWidth,
      }}
    >
      <div ref={measureRef} className="h-full w-full">
        {children}
      </div>
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  return useContext(LayoutContext);
}
