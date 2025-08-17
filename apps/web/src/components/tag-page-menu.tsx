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
  onExportCsv?: () => void;
  trigger?: React.ReactNode;
}

export function TagPageMenu({
  tagName,
  className,
  isPinned,
  onTogglePin,
  onDelete,
  onExportCsv,
  trigger,
}: TagPageMenuProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
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
            <Pin
              className={`${isPinned ? 'fill-foreground' : ''} mr-2 size-4`}
            />
            {isPinned ? 'Unpin' : 'Pin'}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Settings className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onDelete} variant="destructive">
            <Trash className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>

          {onExportCsv && (
            <DropdownMenuItem onClick={onExportCsv}>
              <Download className="mr-2 size-4" />
              Export
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <TagEditDialog name={tagName} open={editOpen} setOpen={setEditOpen} />
    </>
  );
}
