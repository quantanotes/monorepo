import { Button } from '@quanta/ui/button';
import { Pin } from 'lucide-react';

export interface PinButtonProps {
  isPinned: boolean;
  pinCount: number;
  onTogglePin: () => void;
}

export function PinButton({ isPinned, pinCount, onTogglePin }: PinButtonProps) {
  return (
    <Button
      className={`h-8 ${isPinned && 'text-foreground'}`}
      variant="ghost"
      onClick={onTogglePin}
    >
      <Pin className={`size-5 ${isPinned && 'fill-foreground'}`} />
      <span className="text-xs">{pinCount}</span>
    </Button>
  );
}
