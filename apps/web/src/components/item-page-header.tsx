import { Button } from '@quanta/ui/button';
import { X } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { PinButton } from './pin-button';
import { LikeButton } from './like-button';

interface ItemHeaderProps {
  isPinned: boolean;
  isLiked: boolean;
  pinCount: number;
  likeCount: number;
  onDelete: () => void;
  onTogglePin: () => void;
  onToggleLike: () => void;
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
  return (
    <>
      <PinButton
        isPinned={isPinned}
        pinCount={pinCount}
        onTogglePin={onTogglePin}
      />

      <LikeButton
        isLiked={isLiked}
        likeCount={likeCount}
        onToggleLike={onToggleLike}
      />

      <Button className="size-8" variant="ghost" asChild>
        <Link to="/">
          <X />
        </Link>
      </Button>
    </>
  );
}
