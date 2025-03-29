import { Button } from '@quanta/ui/button';
import { Heart } from 'lucide-react';

export interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  onToggleLike: () => void;
}

export function LikeButton({
  isLiked,
  likeCount,
  onToggleLike,
}: LikeButtonProps) {
  return (
    <Button
      className={`h-8 ${isLiked && 'text-foreground'}`}
      variant="ghost"
      onClick={onToggleLike}
    >
      <Heart className={`size-5 ${isLiked && 'fill-foreground'}`} />
      <span className="text-xs">{likeCount}</span>
    </Button>
  );
}
