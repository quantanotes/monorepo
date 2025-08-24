import { memo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import Document from '@tiptap/extension-document';
import StarterKit from '@tiptap/starter-kit';
import { TaskList } from '@tiptap/extension-list';
import { Dropcursor } from '@tiptap/extensions';
import { Settings } from '@quanta/web/lib/text/extensions/settings';
import { Tags } from '@quanta/web/lib/text/extensions/tags';
import { TaskItem } from '@quanta/web/lib/text/extensions/task-item';
import { SlashCommands } from '@quanta/web/lib/text/extensions/slash-commands';
import { DragHandle } from '@quanta/web/lib/text/extensions/drag-handle';
import { BubbleMenu } from '@quanta/web/lib/text/extensions/bubble-menu';

const PLACEHOLDER_CLASS = `tiptap-placeholder`;

const placeholder = ({ node }) =>
  node.type?.name === 'settings'
    ? 'Title...'
    : node.type?.name === 'paragraph'
      ? 'Type / for commands or # for tags...'
      : '';

const extensions = () => [
  Document.extend({ content: 'settings block*' }),
  Dropcursor.configure({
    width: 6,
    color: 'var(--ring)',
  }),
  Placeholder.configure({
    placeholder,
    emptyNodeClass: 'tiptap-placeholder',
  }),
  Settings,
  SlashCommands,
  StarterKit.configure({ document: false }),
  Tags,
  TaskList.configure({
    HTMLAttributes: {
      class: 'pl-2!',
    },
  }),
  TaskItem.configure({
    nested: true,
  }),
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
    const doc = new DOMParser().parseFromString(body, 'text/html');

    const name = doc.body.firstElementChild
      ? doc.body.firstElementChild.innerHTML
      : '';

    const content = doc.body.innerHTML
      .replace(doc.body.firstElementChild?.outerHTML || '', '')
      .trim();

    return [name, content] as [string, string];
  }

  function handleUpdate() {
    onUpdate?.(...parseEditor(editor));
  }

  return (
    <>
      <EditorContent
        className="prose relative mx-auto w-full max-w-3xl pb-32"
        editor={editor}
      />

      <BubbleMenu editor={editor} />

      <DragHandle editor={editor} />
    </>
  );
});
