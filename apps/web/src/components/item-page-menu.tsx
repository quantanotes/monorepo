import { Ellipsis, Trash, Pin } from 'lucide-react';
import { cn } from '@quanta/ui/utils/css';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@quanta/ui/dropdown-menu';
import { Button } from '@quanta/ui/button';

interface ItemPageMenuProps {
  className?: string;
  isPinned: boolean;
  onTogglePin: () => void;
  onDelete?: () => void;
}

export function ItemPageMenu({
  className,
  isPinned,
  onTogglePin,
  onDelete,
}: ItemPageMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn('size-8', className)} variant="ghost" size="icon">
          <Ellipsis className="text-muted-foreground size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onTogglePin}>
          <Pin className={`${isPinned && 'fill-foreground'}`} />
          {isPinned ? 'Unpin' : 'Pin'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} variant="destructive">
          <Trash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
