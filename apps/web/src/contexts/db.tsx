import { use, useEffect, useState } from 'react';
import { usePGlite, PGliteProvider } from '@electric-sql/pglite-react';
import { DB } from '@quanta/db/local';
import { getDB } from '@quanta/db/local/browser';
import { useSpace } from '@quanta/web/hooks/use-space';
import { useAuthUser } from '../hooks/use-auth-user';

export function DBProvider({ children }: React.PropsWithChildren) {
  const space = useSpace();
  const user = useAuthUser();
  const [db, setDB] = useState<DB>();

  useEffect(() => {
    getDB().then(setDB);
  }, []);

  if (!db && space && !user) {
    return <>Loading DB...</>;
  } else {
    return <PGliteProvider db={db}>{children}</PGliteProvider>;
  }
}

export function useDBUnresolved() {}

export function useDB() {
  return use(getDB());
}
