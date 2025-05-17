import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { useItemContext } from '@quanta/web/contexts/item';
import { ItemTag } from '@quanta/web/components/item-tag';

export function SettingsView() {
  const item = useItemContext();
  return (
    <NodeViewWrapper>
      <NodeViewContent
        className="text-7xl!"
        data-placeholder="Title..."
        as="h1"
      />
      <div className="my-6 flex flex-wrap gap-2" contentEditable={false}>
        {Object.values(item.tags || {}).map((tag) => (
          <ItemTag key={tag.id} itemTag={tag} />
        ))}
      </div>
    </NodeViewWrapper>
  );
}
