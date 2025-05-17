import { State } from '@hookstate/core';
import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Item } from '@quanta/types';
import { SettingsView } from './view';

export interface SettingsOptions {
  item: State<Item>;
}

export const Settings = Node.create<SettingsOptions>({
  name: 'settings',
  group: 'block',
  content: 'inline*',

  addOptions() {
    return {
      item: null!,
    };
  },

  addStorage() {
    return {
      item: this.options.item,
    };
  },

  parseHTML() {
    return [
      {
        tag: 'settings',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['settings', mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SettingsView);
  },
});
