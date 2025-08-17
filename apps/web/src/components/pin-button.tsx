import { Button } from '@quanta/ui/button';
import { Pin } from 'lucide-react';

export interface PinButtonProps {
  isPinned?: boolean;
  pinCount?: number;
  onTogglePin: () => void;
}

export function PinButton({
  isPinned = false,
  pinCount,
  onTogglePin,
}: PinButtonProps) {
  return (
    <Button
      className={`p-2 ${isPinned && 'text-foreground'}`}
      variant="ghost"
      onClick={onTogglePin}
    >
      <Pin className={`size-4 ${isPinned && 'fill-foreground'}`} />
      {typeof pinCount === 'number' && (
        <span className="w-3 text-xs">{pinCount}</span>
      )}
    </Button>
  );
}
