import { useSpace } from '@quanta/web/hooks/use-space';
import { PinButton } from '@quanta/web/components/pin-button';
import { LikeButton } from '@quanta/web/components/like-button';
import { ItemPageMenu } from '@quanta/web/components/item-page-menu';

interface ItemHeaderProps {
  itemId: string;
  isPinned: boolean;
  isLiked?: boolean;
  pinCount?: number;
  likeCount?: number;
  onDelete?: () => void;
  onTogglePin: () => void;
  onToggleLike?: () => void;
}

export function ItemPageHeader({
  itemId,
  isPinned,
  isLiked,
  pinCount,
  likeCount,
  onDelete,
  onTogglePin,
  onToggleLike,
}: ItemHeaderProps) {
  const space = useSpace();

  return (
    <>
      {onTogglePin && (
        <PinButton
          isPinned={isPinned}
          pinCount={pinCount}
          onTogglePin={onTogglePin}
        />
      )}

      {onToggleLike && (
        <LikeButton
          isLiked={isLiked}
          likeCount={likeCount}
          onToggleLike={onToggleLike}
        />
      )}

      <ItemPageMenu
        className="size-7"
        itemId={itemId}
        isPinned={isPinned}
        onTogglePin={onTogglePin}
        onDelete={onDelete}
      />
    </>
  );
}
