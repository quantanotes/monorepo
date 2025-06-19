import { Link } from '@tanstack/react-router';
import { XIcon } from 'lucide-react';
import { Badge } from '@quanta/ui/badge';
import { Button } from '@quanta/ui/button';
import { useSpace } from '@quanta/web/hooks/use-space';

interface ItemTagProps {
  itemTag: any;
  onDelete?: () => void;
}

export function ItemTag({ itemTag, onDelete }: ItemTagProps) {
  const space = useSpace();

  return (
    <div
      className={`group/menu-item relative flex items-center rounded-md border`}
    >
      <Badge
        className="peer/menu-button justify-start truncate border-0 bg-none text-base"
        variant="outline"
        asChild
      >
        <Link
          className="not-prose"
          to={space ? '/s/$spaceId/t/$tagName' : '/'}
          params={{ tagName: itemTag.name, spaceId: space?.id }}
        >
          <span className={onDelete && 'truncate pr-6'}>
            {`#${itemTag.name}${itemTag.value != null || itemTag.value! === undefined ? `:${itemTag.value}` : ''}`}
          </span>
        </Link>
      </Badge>

      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-destructive absolute right-1 size-4 opacity-0 transition-opacity group-hover/menu-item:opacity-100"
          onClick={onDelete}
        >
          <XIcon className="size-3" />
        </Button>
      )}
    </div>
  );
}
