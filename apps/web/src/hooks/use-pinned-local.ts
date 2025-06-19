import { useCallback } from 'react';
import { useLiveQuery } from '@electric-sql/pglite-react';
import { snakeToCamelObject } from '@quanta/utils/snake-to-camel';
import { PinnedModelLocal } from '@quanta/web/lib/pinned-model-local';
import { useDB } from '@quanta/web/contexts/db';
import { useSpace } from '@quanta/web/hooks/use-space';

export function usePinnedLocal() {
  const space = useSpace()!;
  const db = useDB()!;

  const model = new PinnedModelLocal(db.orm, space.id);

  const { sql, params } = model.getAllQuery().toSQL();

  const pinned = useLiveQuery(sql, params)?.rows.map(snakeToCamelObject) || [];

  const togglePinItem = (itemId: string) => model.togglePinItem(itemId);

  const togglePinTag = (tagId: string) => model.togglePinTag(tagId);

  const isItemPinned = useCallback(
    (itemId: string) =>
      pinned?.some((pinned) => pinned.itemId === itemId) ?? false,
    [pinned],
  );

  const isTagPinned = useCallback(
    (tagName: string) =>
      pinned?.some(
        (pinned) => pinned.name === tagName && pinned.type === 'tag',
      ) ?? false,
    [pinned],
  );

  return { pinned, togglePinItem, togglePinTag, isItemPinned, isTagPinned };
}
