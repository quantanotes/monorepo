import {
  forwardRef,
  useState,
  useImperativeHandle,
  useRef,
  useMemo,
} from 'react';
import {
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  AlignLeftIcon,
  QuoteIcon,
  CodeIcon,
  ListIcon,
  ListOrderedIcon,
  CheckSquareIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  MinusIcon,
  ArrowDownCircleIcon,
} from 'lucide-react';
import { Popover, PopoverAnchor, PopoverContent } from '@quanta/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from '@quanta/ui/command';
import type { SuggestionProps } from '@tiptap/suggestion';

export interface SlashCommandsViewRef {
  onKeyDown: (event: KeyboardEvent) => boolean;
  hide: () => void;
}

interface SlashCommand {
  title: string;
  description?: string;
  icon: React.FC;
  command: (props: any) => any;
  keywords: string[];
}

const commands: SlashCommand[] = [
  {
    title: 'Heading 1',
    icon: Heading1Icon,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 1 })
        .run(),
    keywords: ['h1', 'heading', 'title'],
  },
  {
    title: 'Heading 2',
    icon: Heading2Icon,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 2 })
        .run(),
    keywords: ['h2', 'heading', 'subtitle'],
  },
  {
    title: 'Heading 3',
    icon: Heading3Icon,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 3 })
        .run(),
    keywords: ['h3', 'heading'],
  },
  {
    title: 'Paragraph',
    icon: AlignLeftIcon,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode('paragraph').run(),
    keywords: ['p', 'paragraph', 'text'],
  },
  {
    title: 'Quote',
    icon: QuoteIcon,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode('blockquote').run(),
    keywords: ['quote', 'blockquote', 'citation'],
  },
  {
    title: 'Code Block',
    icon: CodeIcon,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode('codeBlock').run(),
    keywords: ['code', 'codeblock', 'programming'],
  },
  {
    title: 'Bullet List',
    icon: ListIcon,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
    keywords: ['ul', 'bullet', 'list', 'unordered'],
  },
  {
    title: 'Numbered List',
    icon: ListOrderedIcon,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
    keywords: ['ol', 'numbered', 'list', 'ordered'],
  },
  {
    title: 'Task List',
    icon: CheckSquareIcon,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleTaskList().run(),
    keywords: ['todo', 'task', 'checklist', 'checkbox'],
  },
  {
    title: 'Bold',
    icon: BoldIcon,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setMark('bold').run(),
    keywords: ['bold', 'strong', 'b'],
  },
  {
    title: 'Italic',
    icon: ItalicIcon,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setMark('italic').run(),
    keywords: ['italic', 'emphasis', 'i'],
  },
  {
    title: 'Underline',
    icon: UnderlineIcon,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setMark('underline').run(),
    keywords: ['underline', 'u'],
  },
  {
    title: 'Strikethrough',
    icon: StrikethroughIcon,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setMark('strike').run(),
    keywords: ['strike', 'strikethrough', 'delete'],
  },
  {
    title: 'Divider',
    icon: MinusIcon,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
    keywords: ['hr', 'divider', 'separator', 'line'],
  },
  {
    title: 'Hard Break',
    icon: ArrowDownCircleIcon,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHardBreak().run(),
    keywords: ['break', 'newline', 'br'],
  },
];

export const SlashCommandsView = forwardRef<
  SlashCommandsViewRef,
  SuggestionProps
>(({ query, clientRect, command }, ref) => {
  const anchorRef = useRef({ getBoundingClientRect: () => clientRect!()! });
  const commandListRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(true);

  const filteredCommands = useMemo(() => {
    if (!query) return commands;
    const searchTerm = query.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(searchTerm) ||
        cmd.description?.toLowerCase().includes(searchTerm) ||
        cmd.keywords?.some((keyword) => keyword.includes(searchTerm)),
    );
  }, [query, commands]);

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

  function handleSelect(selectedCommand: SlashCommand) {
    command({ command: selectedCommand.command });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor virtualRef={anchorRef} />
      <PopoverContent
        className="w-64 p-0"
        align="start"
        side="bottom"
        sideOffset={5}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <Command
          onKeyDown={(event) => event.stopPropagation()}
          shouldFilter={false}
          loop
        >
          <CommandList ref={commandListRef} className="max-h-80">
            {filteredCommands.length === 0 ? (
              <CommandEmpty>No results found.</CommandEmpty>
            ) : (
              filteredCommands.map((cmd, index) => (
                <CommandItem
                  key={cmd.title}
                  value={cmd.title}
                  onSelect={() => handleSelect(cmd)}
                  className="flex items-center gap-2 px-3 py-1 text-sm"
                >
                  <cmd.icon className="mr-2 size-4" />
                  <div className="truncate">{cmd.title}</div>
                </CommandItem>
              ))
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
