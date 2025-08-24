import { Extension } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import { PluginKey } from '@tiptap/pm/state';
import Suggestion from '@tiptap/suggestion';
import { SlashCommandsView } from './view';
import type { SuggestionOptions } from '@tiptap/suggestion';

export const SlashCommands = Extension.create({
  name: 'slash-commands',

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
  pluginKey: new PluginKey('slash-commands'),

  char: '/',

  command({ editor, range, props }) {
    props.command({ editor, range });
  },

  render() {
    let component: ReactRenderer<any>;

    return {
      onStart(props) {
        component = new ReactRenderer(SlashCommandsView, {
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
        } else {
          return component.ref?.onKeyDown(props.event);
        }
      },
      onExit() {
        component.destroy();
      },
    };
  },
};
