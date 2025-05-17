import { useState } from 'react';
import { Ellipsis, Trash, Settings, Pin } from 'lucide-react';
import { cn } from '@quanta/ui/utils/css';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@quanta/ui/dropdown-menu';
import { Button } from '@quanta/ui/button';
import { TagEditDialog } from '@quanta/web/components/tag-edit-dialog';

interface TagPageMenuProps {
  tagName: string;
  className?: string;
  isPinned: boolean;
  onTogglePin: () => void;
  onDelete: () => void;
}

export function TagPageMenu({
  tagName,
  className,
  isPinned,
  onTogglePin,
  onDelete,
}: TagPageMenuProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={cn('size-8', className)}
            variant="ghost"
            size="icon"
          >
            <Ellipsis className="text-muted-foreground size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onTogglePin}>
            <Pin className={`${isPinned && 'fill-foreground'}`} />
            {isPinned ? 'Unpin' : 'Pin'}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Settings />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onDelete} variant="destructive">
            <Trash />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TagEditDialog name={tagName} open={editOpen} setOpen={setEditOpen} />
    </>
  );
}
