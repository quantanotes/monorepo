import { useEffect, useState } from 'react';
import { usePGlite, PGliteProvider } from '@electric-sql/pglite-react';
import { DB } from '@quanta/db/local';
import { getDB } from '@quanta/db/local/browser';

export function DBProvider({ children }: React.PropsWithChildren) {
  const [db, setDB] = useState<DB>();

  useEffect(() => {
    getDB().then(setDB);
  }, []);

  if (!db) {
    return null;
  }

  return <PGliteProvider db={db}>{children}</PGliteProvider>;
}

export function useDB() {
  return usePGlite() as DB;
}
