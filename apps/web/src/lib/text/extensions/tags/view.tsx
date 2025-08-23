import { forwardRef, useState, useImperativeHandle, useRef } from 'react';
import { Popover, PopoverAnchor, PopoverContent } from '@quanta/ui/popover';
import { Command, CommandItem, CommandList } from '@quanta/ui/command';
import { useItemModel } from '@quanta/web/contexts/item-model';
import { useItem } from '@quanta/web/contexts/item';
import type { SuggestionProps } from '@tiptap/suggestion';

export interface TagsViewRef {
  onKeyDown: (event: KeyboardEvent) => boolean;
  hide: () => void;
}

export const TagsView = forwardRef<TagsViewRef, SuggestionProps>(
  ({ query, clientRect, command }, ref) => {
    const anchorRef = useRef({ getBoundingClientRect: () => clientRect!()! });
    const commandListRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(true);
    const { tagItem } = useItemModel();
    const item = useItem();

    const tag = query.replace(/:.*/, '');
    const value =
      query.indexOf(':') > 0 ? query.slice(query.indexOf(':') + 1) : null;

    const options = !value
      ? [{ type: undefined, value: 'default', label: `Add tag #${tag}` }]
      : [
          {
            type: 'text',
            value: 'text',
            label: `Add tag #${tag} with text ${value}`,
          },
          {
            type: 'number',
            value: 'number',
            label: `Add tag #${tag} with number ${value}`,
          },
          {
            type: 'boolean',
            value: 'boolean',
            label: `Add tag #${tag} with boolean ${value === 'true' ? 'true' : 'false'}`,
          },
        ];

    useImperativeHandle(ref, () => ({
      onKeyDown(event) {
        switch (event.key) {
          case 'ArrowUp':
          case 'ArrowDown':
          case 'Enter':
            if (commandListRef.current) {
              commandListRef.current.dispatchEvent(
                new KeyboardEvent('keydown', {
                  key: event.key,
                  bubbles: true,
                  cancelable: true,
                }),
              );
            }
            event.preventDefault();
            return true;
          default:
            return false;
        }
      },
      hide() {
        setOpen(false);
      },
    }));

    function handleSelect(type?: string) {
      const itemId = item.id;
      switch (type) {
        case 'number':
          tagItem(itemId, tag, parseFloat(value!), 'number');
          break;
        case 'boolean':
          tagItem(itemId, tag, value === 'true', 'boolean');
          break;
        case 'text':
          tagItem(itemId, tag, value, 'text');
          break;
        default:
          tagItem(itemId, tag);
          break;
      }
      command(null);
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor virtualRef={anchorRef} />
        <PopoverContent
          className="w-fit p-0"
          align="start"
          side="bottom"
          sideOffset={5}
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <Command
            key={options[0].value}
            defaultValue={options[0].value}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <CommandList ref={commandListRef}>
              {options.map((option, index) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.type)}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);
