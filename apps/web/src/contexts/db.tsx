import { useEffect, useState } from 'react';
import { makePGliteProvider } from '@electric-sql/pglite-react';
import { DB } from '@quanta/db/local';
import { getDB } from '@quanta/db/local/browser';

const { PGliteProvider, usePGlite } = makePGliteProvider<DB>();

export function DBProvider({ children }: React.PropsWithChildren) {
  const [db, setDB] = useState<DB>();
  useEffect(() => {
    getDB().then(setDB);
  }, []);
  return <PGliteProvider db={db}>{children}</PGliteProvider>;
}

export { usePGlite as useDB };
