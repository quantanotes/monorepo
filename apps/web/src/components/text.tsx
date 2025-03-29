import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { Settings } from '@quanta/web/lib/text/extensions/settings';
import { Tags } from '@quanta/web/lib/text/extensions/tags';

interface TextProps {
  item: { name: string; content: string };
  onUpdate?: (name: string, content: string) => void;
  editable?: boolean;
}

export function Text({ item, onUpdate, editable = true }: TextProps) {
  const editor = useEditor({
    extensions: [
      Settings.configure({}),

      Tags,

      Document.extend({
        content: 'settings block*',
      }),

      Link,

      Placeholder.configure({
        placeholder: ({ node }) =>
          node.type.name === 'settings' ? 'Title...' : 'Create anything...',
        emptyNodeClass:
          'cursor-text before:absolute before:content-[attr(data-placeholder)] data-[placeholder=Title...]:text-6xl data-[placeholder=Title...]:p-3 data-[placeholder=Title...]:font-bold before:text-muted-foreground before-pointer-events-none',
      }),

      StarterKit.configure({
        document: false,
      }),
    ],

    editorProps: {
      attributes: { class: 'focus:outline-hidden w-full' },
    },

    onUpdate: ({ editor }) => {
      const [title, content] = parseEditor(editor);
      handleUpdate(title, content);
    },

    immediatelyRender: false,
    editable,

    content: `<settings><h1>${item.name}</h1></settings>${item.content || ''}`,
  });

  function parseEditor(editor: any) {
    const body = editor.getHTML();
    const parser = new DOMParser();
    const doc = parser.parseFromString(body, 'text/html');
    const title = doc.body.firstElementChild
      ? doc.body.firstElementChild.innerHTML
      : '';
    const content = doc.body.innerHTML
      .replace(doc.body.firstElementChild?.outerHTML || '', '')
      .trim();
    return [title, content] as [string, string];
  }

  function handleUpdate(name: string, content: string) {
    onUpdate?.(name, content);
  }

  return (
    <EditorContent
      className="prose prose-neutral dark:prose-invert mx-auto w-full max-w-none pb-32"
      editor={editor}
    />
  );
}
