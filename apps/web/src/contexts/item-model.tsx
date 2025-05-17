import { ReactNode, createContext, useContext } from 'react';
import { useSpace } from '@quanta/web/hooks/use-space';
import { useItemModelRemote } from '@quanta/web/hooks/use-item-model-remote';
import { useItemModelLocal } from '@quanta/web/hooks/use-item-model-local';

type ItemModelContextType =
  | ReturnType<typeof useItemModelRemote>
  | ReturnType<typeof useItemModelLocal>;

const ItemModelContext = createContext<ItemModelContextType>(null!);

export function ItemModelProvider({ children }: { children: ReactNode }) {
  const space = useSpace();
  if (space) {
    return <ItemModelLocalProvider>{children}</ItemModelLocalProvider>;
  } else {
    return <ItemModelRemoteProvider>{children}</ItemModelRemoteProvider>;
  }
}

function ItemModelRemoteProvider({ children }: { children: ReactNode }) {
  const remote = useItemModelRemote();
  return (
    <ItemModelContext.Provider value={remote}>
      {children}
    </ItemModelContext.Provider>
  );
}

function ItemModelLocalProvider({ children }: { children: ReactNode }) {
  const local = useItemModelLocal();
  return (
    <ItemModelContext.Provider value={local}>
      {children}
    </ItemModelContext.Provider>
  );
}

export function useItemModel() {
  const context = useContext(ItemModelContext);
  if (context === null) {
    throw new Error('useItemModel must be used within an ItemModelProvider');
  }
  return context;
}
