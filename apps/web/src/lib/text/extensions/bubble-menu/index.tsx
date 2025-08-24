import { BubbleMenu as BaseBubbleMenu } from '@tiptap/react/menus';
import { Button } from '@quanta/ui/button';
import {
  Bold,
  Italic,
  Strikethrough,
  Underline,
  Code,
  Link,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface BubbleMenuItem {
  name: string;
  icon: LucideIcon;
  command: (editor: any) => void;
  isActive?: (editor: any) => boolean;
  label?: string;
}

interface BubbleMenuGroup {
  items: BubbleMenuItem[];
}

interface BubbleMenuProps {
  editor: any;
}

const groups: BubbleMenuGroup[] = [
  {
    items: [
      {
        name: 'bold',
        icon: Bold,
        command: (editor) => editor.chain().focus().toggleBold().run(),
        isActive: (editor) => editor.isActive('bold'),
      },
      {
        name: 'italic',
        icon: Italic,
        command: (editor) => editor.chain().focus().toggleItalic().run(),
        isActive: (editor) => editor.isActive('italic'),
      },
      {
        name: 'underline',
        icon: Underline,
        command: (editor) => editor.chain().focus().toggleUnderline().run(),
        isActive: (editor) => editor.isActive('underline'),
      },
      {
        name: 'strike',
        icon: Strikethrough,
        command: (editor) => editor.chain().focus().toggleStrike().run(),
        isActive: (editor) => editor.isActive('strike'),
      },
      {
        name: 'code',
        icon: Code,
        command: (editor) => editor.chain().focus().toggleCode().run(),
        isActive: (editor) => editor.isActive('code'),
      },
    ],
  },
  {
    items: [
      {
        name: 'heading1',
        icon: Heading1,
        command: (editor) =>
          editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: (editor) => editor.isActive('heading', { level: 1 }),
      },
      {
        name: 'heading2',
        icon: Heading2,
        command: (editor) =>
          editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: (editor) => editor.isActive('heading', { level: 2 }),
      },
      {
        name: 'heading3',
        icon: Heading3,
        command: (editor) =>
          editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: (editor) => editor.isActive('heading', { level: 3 }),
      },
    ],
  },
  {
    items: [
      {
        name: 'link',
        icon: Link,
        command: (editor) => {
          const previousUrl = editor.getAttributes('link').href;
          const url = window.prompt('URL', previousUrl);

          if (url === null) {
            return;
          }

          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
          }

          editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
        },
        isActive: (editor) => editor.isActive('link'),
      },
    ],
  },
];

export function BubbleMenu({ editor }: BubbleMenuProps) {
  if (!editor) {
    return null;
  }

  return (
    <BaseBubbleMenu
      editor={editor}
      className="bg-background flex items-center gap-1 rounded-lg border p-1 shadow-md"
    >
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="flex items-center">
          {group.items.map((item, itemIndex) => {
            const Icon = item.icon;
            const isActive = item.isActive ? item.isActive(editor) : false;

            return (
              <Button
                key={item.name}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => item.command(editor)}
                className="size-8"
                title={item.label || item.name}
              >
                <Icon className="size-4" />
              </Button>
            );
          })}

          {groupIndex < groups.length - 1 && (
            <div className="bg-border ml-1 h-6 w-[1px]"></div>
          )}
        </div>
      ))}

      <div className="bg-border h-6 w-[1px]"></div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        className="h-8 px-2 text-xs"
        title="Clear formatting"
      >
        Clear
      </Button>
    </BaseBubbleMenu>
  );
}
