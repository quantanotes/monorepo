import { createContext, useContext } from 'react';
import { Item } from '@quanta/types';

const ItemContext = createContext<Item>(null!);

export const ItemProvider = ItemContext;

export function useItemContext() {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('useItemContext must be used within an ItemProvider');
  }
  return context;
}
