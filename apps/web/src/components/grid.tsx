import { useEffect, useMemo, useRef, useState } from 'react';
import { Masonry } from 'masonic';
import { ClientOnly } from '@quanta/web/components/client-only';
import { GridCard } from '@quanta/web/components/grid-card';
import { useMeasure } from '@quanta/web/hooks/use-measure';

export const Grid = ({ items }) =>
  ClientOnly({ children: GridInner({ items }) });

function GridInner({ items }) {
  const minColumnWidth = 320;
  const maxColumns = 10;
  const [ref, { width }] = useMeasure();
  const [masonryKey, setMasonryKey] = useState(0);
  const [isResizing, setIsResizing] = useState(false);
  const resizeTimeout = useRef<NodeJS.Timeout | null>(null);
  const columnCount = useMemo(
    () => Math.max(1, Math.min(Math.floor(width / minColumnWidth), maxColumns)),
    [width],
  );

  useEffect(() => {
    setIsResizing(true);
    if (resizeTimeout.current) {
      clearTimeout(resizeTimeout.current);
    }

    resizeTimeout.current = setTimeout(() => {
      setMasonryKey((prevKey) => prevKey + 1);
      setIsResizing(false);
    }, 50);
  }, [width]);

  return (
    <div ref={ref} className="w-full" key={items}>
      {!isResizing && (
        <Masonry
          key={masonryKey}
          columnGutter={8}
          rowGutter={8}
          items={items}
          render={GridCard}
          columnCount={columnCount}
        />
      )}
    </div>
  );
}
