import { Ellipsis, Trash, Pin, MessageCircle } from 'lucide-react';
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
  trigger?: React.ReactNode;
}

export function ItemPageMenu({
  className,
  itemId,
  isPinned,
  onTogglePin,
  onDelete,
  trigger,
}: ItemPageMenuProps) {
  const { addAttachment } = useAiChat();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <Button className={className} variant="ghost" size="icon">
            <Ellipsis className="size-4" />
          </Button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onTogglePin}>
          <Pin className={`${isPinned ? 'fill-foreground' : ''} mr-2 size-4`} />
          {isPinned ? 'Unpin' : 'Pin'}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => addAttachment('item', itemId)}>
          <MessageCircle className="mr-2 size-4" />
          Add to chat
        </DropdownMenuItem>

        {onDelete && (
          <DropdownMenuItem onClick={onDelete} variant="destructive">
            <Trash className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
