import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

export default function SettingsView() {
  return (
    <NodeViewWrapper className="settings">
      <NodeViewContent
        className="text-6xl font-bold"
        as="h1"
        data-placeholder="Title..."
      />
      {/* <div className="mx-2 my-6 flex flex-wrap gap-2">
      </div> */}
    </NodeViewWrapper>
  );
}
