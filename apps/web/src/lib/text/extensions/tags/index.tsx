import { Extension } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion, { type SuggestionOptions } from '@tiptap/suggestion';
import { TagsView } from './view';

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
    let component: ReactRenderer<any>;

    return {
      onStart(props) {
        component = new ReactRenderer(TagsView, {
          props,
          editor: props.editor,
        });
      },

      onUpdate(props) {
        component.updateProps(props);
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          component.ref?.hide();
          return true;
        }
        return component.ref?.onKeyDown(props.event);
      },

      onExit() {
        component.destroy();
      },
    };
  },
};
