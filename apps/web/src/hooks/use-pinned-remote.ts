import { useCallback, useMemo } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Pinned } from '@quanta/types';
import { snakeToCamlObject } from '@quanta/utils/snake-to-camel';
import { useShapeWithJoin } from '@quanta/web/hooks/use-shape-with-join';
import { togglePinItemFn } from '@quanta/web/lib/pinned-fns';

export function usePinnedRemote() {
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
      columns: ['id', 'name', 'author_id'],
    },
  });

  const togglePinItemServerFn = useServerFn(togglePinItemFn);

  const togglePinItem = useCallback(
    (itemId: string) => {
      togglePinItemServerFn({ data: { id: itemId } });
    },
    [togglePinItemServerFn],
  );

  const isItemPinned = useCallback(
    (itemId: string) => {
      return pinned.some(
        (pin) => pin.type === 'item' && pin.item_id === itemId,
      );
    },
    [pinned],
  );

  return useMemo(
    () => ({
      pinned: pinned.map(snakeToCamlObject) as Pinned[],
      togglePinItem: togglePinItem,
      isItemPinned,
    }),
    [pinned, togglePinItem, isItemPinned],
  );
}
