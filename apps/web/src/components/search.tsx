import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { debounce } from '@quanta/utils/debounce';
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@quanta/ui/command';
import { useItemModel } from '@quanta/web/contexts/item-model';
import { useSpace } from '@quanta/web/hooks/use-space';
import type { Item } from '@quanta/types';

interface SearchProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

export function Search({ show, setShow }: SearchProps) {
  const [results, setResults] = useState<Item[]>([]);
  const [input, setInput] = useState('');
  const space = useSpace();
  const itemModel = useItemModel();
  const searchItems = itemModel?.searchItems;

  const search = debounce(async () => {
    const results = await searchItems?.(input);
    setResults(results || []);
  }, 400);

  useEffect(() => {
    search();
  }, [input]);

  return (
    <CommandDialog open={show} onOpenChange={setShow}>
      <CommandInput value={input} onValueChange={setInput} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {results.map((item) => (
          <CommandItem key={item.id} asChild>
            <Link
              href={space ? '/s/$spaceId/$itemId' : '/$itemId'}
              params={{
                spaceId: space?.id,
                itemId: item.id,
              }}
            >
              {item.name}
            </Link>
          </CommandItem>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
