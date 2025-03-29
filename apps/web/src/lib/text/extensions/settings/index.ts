import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import SettingsView from './view';

export interface SettingsOptions {}

export const Settings = Node.create<SettingsOptions>({
  name: 'settings',
  group: 'block',
  content: 'inline*',

  addOptions() {
    return {};
  },

  addStorage() {
    return {};
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
    return ReactNodeViewRenderer(SettingsView, {
      contentDOMElementTag: 'settings',
    });
  },
});
