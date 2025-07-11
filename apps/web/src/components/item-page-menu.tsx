import { Ellipsis, Trash, Pin, MessageCircle } from 'lucide-react';
import { cn } from '@quanta/ui/utils/css';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@quanta/ui/dropdown-menu';
import { Button } from '@quanta/ui/button';
import { useAiChat } from '@quanta/web/contexts/ai-chat';

interface ItemPageMenuProps {
  className?: string;
  itemId: string;
  isPinned: boolean;
  onTogglePin: () => void;
  onDelete?: () => void;
}

export function ItemPageMenu({
  className,
  itemId,
  isPinned,
  onTogglePin,
  onDelete,
}: ItemPageMenuProps) {
  const { addAttachment } = useAiChat();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={className} variant="ghost" size="icon">
          <Ellipsis className="text-muted-foreground size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onTogglePin}>
          <Pin className={`${isPinned && 'fill-foreground'}`} />
          {isPinned ? 'Unpin' : 'Pin'}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => addAttachment('item', itemId)}>
          <MessageCircle />
          Add to chat
        </DropdownMenuItem>

        {onDelete && (
          <DropdownMenuItem onClick={onDelete} variant="destructive">
            <Trash />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
