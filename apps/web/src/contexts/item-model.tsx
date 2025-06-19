import { createContext, useContext } from 'react';
import { useSpace } from '@quanta/web/hooks/use-space';
import { useDBLazy } from '@quanta/web/contexts/db';
import { useItemModelRemote } from '@quanta/web/hooks/use-item-model-remote';
import { useItemModelLocal } from '@quanta/web/hooks/use-item-model-local';

type ItemModelContextType =
  | ReturnType<typeof useItemModelRemote>
  | ReturnType<typeof useItemModelLocal>;

const ItemModelContext = createContext<ItemModelContextType>(null!);

export function ItemModelProvider({ children }: React.PropsWithChildren) {
  const space = useSpace();
  const db = useDBLazy();

  if (space && db) {
    return <ItemModelLocalProvider>{children}</ItemModelLocalProvider>;
  } else {
    return <ItemModelRemoteProvider>{children}</ItemModelRemoteProvider>;
  }
}

function ItemModelRemoteProvider({ children }: React.PropsWithChildren) {
  const remote = useItemModelRemote();

  return <ItemModelContext value={remote}>{children}</ItemModelContext>;
}

function ItemModelLocalProvider({ children }: React.PropsWithChildren) {
  const local = useItemModelLocal();

  return <ItemModelContext value={local}>{children}</ItemModelContext>;
}

export function useItemModel() {
  const context = useContext(ItemModelContext);
  if (context === null) {
    throw new Error('useItemModel must be used within an ItemModelProvider');
  }
  return context;
}
