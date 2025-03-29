import React, { useState, useEffect, useRef } from 'react';
import { Popover, PopoverContent } from '@quanta/ui/popover';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '@quanta/ui/command';

interface TagsViewProps {
  onselect: () => void;
  query: string;
}

const TagsView: React.FC<TagsViewProps> = ({ onselect, query }) => {
  const [open, setOpen] = useState(true);
  const contentRef = useRef<HTMLElement>(null);

  const tag = query.replace(/:.*/, '');
  const value =
    query.indexOf(':') > 0 ? query.slice(query.indexOf(':') + 1) : null;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) {
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'Enter':
        if (contentRef.current) {
          contentRef.current.dispatchEvent(
            new KeyboardEvent('keydown', {
              key: event.key,
              bubbles: true,
              cancelable: true,
            }),
          );
        }
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelect = async (valueType?: string) => {
    onselect();

    switch (valueType) {
      case 'number':
        break;
      case 'text':
        // await objectService.setObjectTag(object.id, tag, value, 'text');
        break;
      default:
      // await objectService.setObjectTag(object.id, tag, null, 'null');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverContent
        className="w-fit p-0"
        align="start"
        side="bottom"
        sideOffset={5}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <Command
          className="w-fit [&>[data-command-input-wrapper]]:hidden"
          onKeyDown={(event) => event.stopPropagation()}
        >
          <CommandInput autoFocus={false} />
          <CommandList>
            <CommandItem onSelect={() => handleSelect()}>
              Add tag #{tag}
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TagsView;
