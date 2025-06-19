import { createContext, useContext } from 'react';
import { Item } from '@quanta/types';

const ItemContext = createContext<Item>(null!);

export const ItemProvider = ItemContext;

export function useItem() {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('useItem must be used within an ItemProvider');
  }
  return context;
}
