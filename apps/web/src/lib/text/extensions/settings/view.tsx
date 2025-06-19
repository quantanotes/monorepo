import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { useItem } from '@quanta/web/contexts/item';
import { useItemModel } from '@quanta/web/contexts/item-model';
import { ItemTag } from '@quanta/web/components/item-tag';

// TODO: check if editable before you can do tag mutations
export function SettingsView() {
  const item = useItem();
  const itemModel = useItemModel();

  return (
    <NodeViewWrapper>
      <NodeViewContent
        className="text-7xl!"
        data-placeholder="Title..."
        as="h1"
      />

      <div className="my-6 flex flex-wrap gap-2" contentEditable={false}>
        {Object.values(item.tags || {}).map((tag) => (
          <ItemTag
            key={tag.id}
            itemTag={tag}
            onDelete={() => itemModel?.untagItem?.(item.id, tag.name)}
          />
        ))}
      </div>
    </NodeViewWrapper>
  );
}
