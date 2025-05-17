import { Button } from '@quanta/ui/button';
import { Heart } from 'lucide-react';

export interface LikeButtonProps {
  isLiked?: boolean;
  likeCount?: number;
  onToggleLike: () => void;
}

export function LikeButton({
  isLiked = false,
  likeCount,
  onToggleLike,
}: LikeButtonProps) {
  return (
    <Button
      className={`h-8 p-2! ${isLiked && 'text-foreground'}`}
      variant="ghost"
      onClick={onToggleLike}
    >
      <Heart className={`size-5 ${isLiked && 'fill-foreground'}`} />
      {typeof likeCount === 'number' && (
        <span className="w-3 text-xs">{likeCount}</span>
      )}
    </Button>
  );
}
