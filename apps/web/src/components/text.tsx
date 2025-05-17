import { TextEditor } from '@quanta/web/components/text-editor';
import { Item } from '@quanta/types';
import { ItemProvider } from '@quanta/web/contexts/item';

interface TextProps {
  item: Item;
  editable?: boolean;
  onUpdate?: (name: string, content: string) => void;
}

export function Text({ item, editable = true, onUpdate }: TextProps) {
  const content = `<settings>${item.name || ''}</settings>${item.content || ''}`;
  return (
    <ItemProvider value={item}>
      <TextEditor onUpdate={onUpdate} editable={editable} content={content} />
    </ItemProvider>
  );
}
