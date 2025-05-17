import { Link } from '@tanstack/react-router';
import { X } from 'lucide-react';
import { Button } from '@quanta/ui/button';
import { useSpace } from '@quanta/web/hooks/use-space';
import { PinButton } from '@quanta/web/components/pin-button';
import { LikeButton } from '@quanta/web/components/like-button';
import { ItemPageMenu } from '@quanta/web/components/item-page-menu';

interface ItemHeaderProps {
  isPinned: boolean;
  isLiked?: boolean;
  pinCount?: number;
  likeCount?: number;
  onDelete?: () => void;
  onTogglePin: () => void;
  onToggleLike?: () => void;
}

export function ItemPageHeader({
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
      <ItemPageMenu
        isPinned={isPinned}
        onTogglePin={onTogglePin}
        onDelete={onDelete}
      />

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

      <Button className="size-8 p-2!" variant="ghost" asChild>
        <Link
          to={space ? '/s/$spaceId' : '/'}
          params={space ? { spaceId: space.id } : undefined}
        >
          <X className="size-5" />
        </Link>
      </Button>
    </>
  );
}
