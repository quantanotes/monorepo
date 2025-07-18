import { useEffect, useState } from 'react';
import { Masonry } from 'masonic';
import { ClientOnly } from '@quanta/web/components/client-only';
import { GridCard } from '@quanta/web/components/grid-card';
import { useMeasure } from '@quanta/web/hooks/use-measure';

export const Grid = ({ items }) =>
  ClientOnly({ children: GridInner({ items }) });

function GridInner({ items }) {
  const [ref, { width }] = useMeasure();
  const [masonryKey, setMasonryKey] = useState(0);

  const getColumnCount = (width: number) => {
    if (width < 600) return 1;
    if (width < 900) return 2;
    return 3;
  };

  const columnCount = getColumnCount(width);

  useEffect(() => {
    setMasonryKey((prevKey) => prevKey + 1);
  }, [width]);

  return (
    <div ref={ref} className="w-full" key={items}>
      <Masonry
        key={masonryKey}
        columnGutter={8}
        rowGutter={8}
        items={items}
        render={GridCard}
        columnCount={columnCount}
      />
    </div>
  );
}
