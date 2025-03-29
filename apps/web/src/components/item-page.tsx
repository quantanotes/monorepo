import { Item } from '@quanta/types';
import { Text } from '@quanta/web/components/text';
import { PageLayout } from '@quanta/web/components/page-layout';
import { ItemPageHeader } from '@quanta/web/components/item-page-header';

interface ItemPageProps {
  item: Item;
  isAuthor: boolean;
  isPinned: boolean;
  isLiked: boolean;
  onUpdate: (name: string, content: string) => void;
  onDelete: () => void;
  onTogglePin: () => void;
  onToggleLike: () => void;
}

export function ItemPage({
  item,
  isAuthor,
  isPinned,
  isLiked,
  onUpdate,
  onDelete,
  onTogglePin,
  onToggleLike,
}: ItemPageProps) {
  if (!item) {
    return <PageLayout />;
  }
  return (
    <PageLayout
      title={item.name}
      headerMenu={
        <ItemPageHeader
          isPinned={isPinned}
          isLiked={isLiked}
          likeCount={item.likeCount}
          pinCount={item.pinCount}
          onDelete={onDelete}
          onTogglePin={onTogglePin}
          onToggleLike={onToggleLike}
        />
      }
    >
      <Text key={item.id} item={item} onUpdate={onUpdate} editable={isAuthor} />
    </PageLayout>
  );
}
