import { use, useEffect, useState } from 'react';
import { PGliteProvider } from '@electric-sql/pglite-react';
import { DB } from '@quanta/db/local';
import { getDB } from '@quanta/db/local/browser';
import { useSpace } from '@quanta/web/hooks/use-space';

export function DBProvider({ children }: React.PropsWithChildren) {
  const space = useSpace();
  const db = useDBLazy();

  if (!db && space) {
    return <>Loading DB...</>;
  } else {
    return <PGliteProvider db={db}>{children}</PGliteProvider>;
  }
}

export function useDBLazy() {
  const [db, setDB] = useState<DB>();

  useEffect(() => {
    getDB().then(setDB);
  }, []);

  return db;
}

export function useDB() {
  return use(getDB());
}
