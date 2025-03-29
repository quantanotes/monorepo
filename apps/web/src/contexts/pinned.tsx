import { createContext, useContext, useCallback, useMemo } from 'react';
import { useShape } from '@electric-sql/react';
import { useServerFn } from '@tanstack/react-start';
import { Pinned } from '@quanta/types';
import { snakeToCamlObject } from '@quanta/utils/snake-to-camel';
import { useShapeWithJoin } from '@quanta/web/hooks/use-shape-with-join';
import { togglePinItemFn } from '@quanta/web/lib/pinned-fns';

interface PinnedContextType {
  pinned: Pinned[];
  togglePinItem: (itemId: string) => void;
  isItemPinned: (itemId: string) => boolean;
}

const PinnedContext = createContext<PinnedContextType | null>(null);

export function PinnedProvider({ children }: React.PropsWithChildren) {
  const pinned = useShapeWithJoin({
    shape1Url: `${process.env.PUBLIC_APP_URL}/api/db/pinned`,
    shape2Url: `${process.env.PUBLIC_APP_URL}/api/db/items`,
    getJoinId: (pin) =>
      pin.type === 'item' && pin.item_id ? pin.item_id : undefined,
    mergeRows: (pin, item) => ({
      ...pin,
      name: item?.name,
    }),
    shape2Params: {
      columns: ['id', 'name'],
    },
  });

  const togglePinItemMutate = useServerFn(togglePinItemFn);
  const togglePinItemCallback = useCallback(
    (itemId: string) => {
      togglePinItemMutate({ data: { id: itemId } });
    },
    [togglePinItemMutate],
  );
  const isItemPinned = useCallback(
    (itemId: string) => {
      return pinned.some(
        (pin) => pin.type === 'item' && pin.item_id === itemId,
      );
    },
    [pinned],
  );

  const contextValue = useMemo(
    () => ({
      pinned: pinned.map(snakeToCamlObject) as Pinned[],
      togglePinItem: togglePinItemCallback,
      isItemPinned,
    }),
    [pinned, togglePinItemCallback, isItemPinned],
  );

  return (
    <PinnedContext.Provider value={contextValue}>
      {children}
    </PinnedContext.Provider>
  );
}

export function usePinned() {
  const context = useContext(PinnedContext);
  if (!context) {
    throw new Error('usePinned must be used within a PinnedProvider');
  }
  return context;
}
