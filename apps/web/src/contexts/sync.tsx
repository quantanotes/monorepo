import { useEffect, useRef } from 'react';
import { startDBSync } from '@quanta/db/local';
import { useDBLazy } from '@quanta/web/contexts/db';
import { useSpace } from '@quanta/web/hooks/use-space';

export function SyncProvider({ children }: React.PropsWithChildren) {
  const space = useSpace();

  if (!space) {
    return children;
  } else {
    return <SyncProviderInner spaceId={space.id}>{children}</SyncProviderInner>;
  }
}

// TODO: add clean up for sync - sync streams are leaked here
export function SyncProviderInner({
  children,
  spaceId,
}: React.PropsWithChildren<{ spaceId: string }>) {
  const synced = useRef(new Set<string>());
  const db = useDBLazy();

  useEffect(() => {
    if (db && spaceId && !synced.current.has(spaceId)) {
      synced.current.add(spaceId);
      startDBSync(db, spaceId);
    }
  }, [db, spaceId]);

  return children;
}
