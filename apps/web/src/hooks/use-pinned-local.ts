import { useCallback } from 'react';
import { useLiveQuery } from '@electric-sql/pglite-react';
import { snakeToCamlObject } from '@quanta/utils/snake-to-camel';
import { PinnedModel } from '@quanta/web/lib/pinned-model';
import { useDB } from '@quanta/web/contexts/db';
import { useSpace } from '@quanta/web/hooks/use-space';

export function usePinnedLocal() {
  const space = useSpace();
  const db = useDB();

  if (!space || !db) {
    return;
  }

  const model = new PinnedModel(db.orm, space.id, null);
  const pinnedQuery = model.getAllQuery().toSQL();
  const pinned =
    useLiveQuery(pinnedQuery.sql, pinnedQuery.params)?.rows.map(
      snakeToCamlObject,
    ) || [];

  const togglePinItem = (itemId: string) => model.togglePinItem(itemId);
  const togglePinTag = (tagId: string) => model.togglePinTag(tagId);

  const isItemPinned = useCallback(
    (itemId: string) =>
      pinned?.some((pinned) => pinned.itemId === itemId) ?? false,
    [pinned],
  );

  const isTagPinned = useCallback(
    (itemId: string) =>
      pinned?.some((pinned) => pinned.itemId === itemId) ?? false,
    [pinned],
  );

  return { pinned, togglePinItem, togglePinTag, isItemPinned, isTagPinned };
}
