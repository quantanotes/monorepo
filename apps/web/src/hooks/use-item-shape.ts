import { useMemo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { itemQueryOptions } from '@quanta/web/lib/item-query';
import { useShape } from '@electric-sql/react';
import { snakeToCamlObject } from '@quanta/utils/snake-to-camel';

export function useItemShape(id: string) {
  const itemQuery = useSuspenseQuery(itemQueryOptions(id));
  const itemShape = useShape({
    url: `${process.env.PUBLIC_APP_URL}/api/db/item/${id}`,
  });
  return useMemo(
    () =>
      itemShape.isLoading
        ? itemQuery.data
        : snakeToCamlObject(itemShape.data.at(0)!),
    [itemQuery, itemShape],
  );
}
