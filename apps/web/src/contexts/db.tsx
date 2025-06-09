import { useEffect, useState } from 'react';
import { usePGlite, PGliteProvider } from '@electric-sql/pglite-react';
import { DB } from '@quanta/db/local';
import { getDB } from '@quanta/db/local/browser';
import { useSpace } from '@quanta/web/hooks/use-space';

export function DBProvider({ children }: React.PropsWithChildren) {
  const db = useDB();
  const space = useSpace();

  if (!db && space) {
    return children;
  } else {
    return <PGliteProvider db={db}>{children}</PGliteProvider>;
  }
}

export function useDB() {
  const [db, setDB] = useState<DB>();

  useEffect(() => {
    getDB().then(setDB);
  }, []);

  return db;
}
