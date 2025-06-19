import { createContext, useContext } from 'react';
import { useSpace } from '@quanta/web/hooks/use-space';
import { useTagModelLocal } from '@quanta/web/hooks/use-tag-model-local';
import { useDBLazy } from '@quanta/web/contexts/db';

type TagModelContextType = ReturnType<typeof useTagModelLocal>;

const TagModelContext = createContext<TagModelContextType>(null!);

export function TagModelProvider({ children }: React.PropsWithChildren) {
  const space = useSpace();
  const db = useDBLazy();

  if (space && db) {
    return <TagModelLocalProvider>{children}</TagModelLocalProvider>;
  } else {
    return <TagModelContext value={undefined}>{children}</TagModelContext>;
  }
}

function TagModelLocalProvider({ children }: React.PropsWithChildren) {
  const tagModel = useTagModelLocal();

  return <TagModelContext value={tagModel}>{children}</TagModelContext>;
}

export function useTagModel() {
  const context = useContext(TagModelContext);
  if (context === null) {
    throw new Error('useTagModel must be used within a TagModelProvider');
  }
  return context;
}
