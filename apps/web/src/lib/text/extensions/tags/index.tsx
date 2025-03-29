import { Extension } from '@tiptap/core';
import Suggestion, { type SuggestionOptions } from '@tiptap/suggestion';
import TagsView from './view';
import { createRoot } from 'react-dom/client';

export const Tags = Extension.create({
  name: 'tags',

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...suggestion,
      }),
    ];
  },
});

const suggestion: Partial<SuggestionOptions> = {
  char: '#',

  command({ editor, range }) {
    editor.chain().focus().deleteRange(range).run();
  },

  render() {
    let root: any = null;
    let element: HTMLDivElement | null = null;

    return {
      onStart(props) {
        const { editor, command } = props;

        element = document.createElement('div');
        editor.view.dom.parentNode?.appendChild(element);

        root = createRoot(element);
        root.render(
          <TagsView onselect={() => command(null)} query={props.query} />,
        );
      },

      onUpdate(props) {
        if (root && element) {
          root.render(
            <TagsView
              onselect={() => props.command(null)}
              query={props.query}
            />,
          );
        }
      },

      onKeyDown(props) {
        const { event } = props;

        if (event.key === 'Escape') {
          if (element) {
            element.style.display = 'none';
          }
          return true;
        }

        if (element) {
          const keyEvent = new KeyboardEvent('keydown', {
            key: event.key,
            bubbles: true,
            cancelable: true,
          });
          element.dispatchEvent(keyEvent);

          if (['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
            return true;
          }
        }

        return false;
      },

      onExit() {
        if (root) {
          root.unmount();
        }

        if (element) {
          element.remove();
        }
      },
    };
  },
};
