import { Ellipsis, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@quanta/ui/dropdown-menu';
import { Button } from '@quanta/ui/button';

interface ItemPageMenuProps {
  isPinned: boolean;
  onTogglePin: () => void;
  onDelete: () => void;
}

export function ItemPageMenu({
  isPinned,
  onTogglePin,
  onDelete,
}: ItemPageMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-8" variant="ghost" size="icon">
          <Ellipsis className="text-muted-foreground size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* <DropdownMenuItem onClick={onTogglePin}>
          <Pin className="mr-2 h-4 w-4" />
          {isPinned ? 'Unpin' : 'Pin'}
        </DropdownMenuItem> */}
        <DropdownMenuItem onClick={onDelete} variant="destructive">
          <Trash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
