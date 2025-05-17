import { memo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import Document from '@tiptap/extension-document';
import StarterKit from '@tiptap/starter-kit';
import { Settings } from '@quanta/web/lib/text/extensions/settings';
import { Tags } from '@quanta/web/lib/text/extensions/tags';

const PLACEHOLDER_CLASS = `\
   cursor-text before:absolute before:content-[attr(data-placeholder)]\
   data-[placeholder=Title...]:text-7xl data-[placeholder=Title...]:p-3\
   data-[placeholder=Title...]:font-bold before:text-muted-foreground\
   before-pointer-events-none`;

const placeholder = (node: any) =>
  node.type?.name === 'settings' ? 'Title...' : 'Create anything...';

const extensions = () => [
  Document.extend({ content: 'settings block*' }),
  Placeholder.configure({ placeholder }),
  Settings,
  StarterKit.configure({ document: false }),
  Tags,
];

interface TextEditorProps {
  editable?: boolean;
  content: string;
  onUpdate?: (name: string, content: string) => void;
}

export const TextEditor = memo(function ({
  editable = true,
  content,
  onUpdate,
}: TextEditorProps) {
  const editor = useEditor({
    extensions: extensions(),
    editorProps: { attributes: { class: 'focus:outline-hidden w-full' } },
    onUpdate: handleUpdate,
    editable,
    content,
  });

  function parseEditor(editor: any) {
    const body = editor.getHTML();
    const parser = new DOMParser();
    const doc = parser.parseFromString(body, 'text/html');
    const name = doc.body.firstElementChild
      ? doc.body.firstElementChild.innerHTML
      : '';
    const content = doc.body.innerHTML
      .replace(doc.body.firstElementChild?.outerHTML || '', '')
      .trim();
    return [name, content] as [string, string];
  }

  function handleUpdate() {
    const [name, content] = parseEditor(editor);
    onUpdate?.(name, content);
  }

  return (
    <EditorContent
      className="themed-prose prose-lg! mx-auto w-full max-w-4xl pb-32"
      editor={editor}
    />
  );
});
