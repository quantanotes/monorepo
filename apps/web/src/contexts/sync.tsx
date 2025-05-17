import { useEffect, useRef } from 'react';
import { useParams } from '@tanstack/react-router';
import { startDBSync } from '@quanta/db/local';
import { useDB } from '@quanta/web/contexts/db';

// TODO: add clean up for sync - sync streams are leaked here
export function SyncProvider({ children }: React.PropsWithChildren) {
  const db = useDB();
  const synced = useRef(new Set<string>());
  const params = useParams({ from: '/s/$spaceId', shouldThrow: false });
  const spaceId = params?.spaceId;

  useEffect(() => {
    if (spaceId && !synced.current.has(spaceId)) {
      synced.current.add(spaceId);
      startDBSync(db, spaceId);
    }
  }, [db, spaceId]);

  return children;
}
