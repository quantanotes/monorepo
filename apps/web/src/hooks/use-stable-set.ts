import { useEffect, useMemo, useState } from 'react';

export function useStableSet(input: string[] = []) {
  const [stableSet, setStableSet] = useState(new Set(input));

  useEffect(() => {
    let updated = false;

    for (const item of input) {
      if (!stableSet.has(item)) {
        updated = true;
      }
    }

    if (updated) {
      setStableSet(new Set(input));
    }
  }, [input]);

  return useMemo(() => Array.from(stableSet), [stableSet]);
}
