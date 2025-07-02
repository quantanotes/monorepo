import { useState } from 'react';
import { Ellipsis, Trash, Settings, Pin, Download } from 'lucide-react';
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
  onExportCsv: () => void;
}

export function TagPageMenu({
  tagName,
  className,
  isPinned,
  onTogglePin,
  onDelete,
  onExportCsv,
}: TagPageMenuProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
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

          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Settings />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onDelete} variant="destructive">
            <Trash />
            Delete
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onExportCsv}>
            <Download />
            Export
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TagEditDialog name={tagName} open={editOpen} setOpen={setEditOpen} />
    </>
  );
}
