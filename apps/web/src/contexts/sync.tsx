import { useEffect } from 'react';
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

export function SyncProviderInner({
  children,
  spaceId,
}: React.PropsWithChildren<{ spaceId: string }>) {
  const db = useDBLazy();

  useEffect(() => {
    if (db && spaceId) {
      startDBSync(db, spaceId);
    }
  }, [db, spaceId]);

  return children;
}
