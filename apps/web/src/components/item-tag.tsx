import { Link } from '@tanstack/react-router';
import { Badge } from '@quanta/ui/badge';
import { useSpace } from '@quanta/web/hooks/use-space';

interface ItemTagProps {
  itemTag: any;
}

export function ItemTag({ itemTag }: ItemTagProps) {
  const space = useSpace();
  return (
    <Badge
      variant="outline"
      className="group flex gap-2 rounded-md text-base font-medium"
      asChild
    >
      <Link
        className="not-prose"
        to={space ? '/s/$spaceId/t/$tagName' : '/'}
        params={{ tagName: itemTag.name, spaceId: space?.id }}
        // target="_self"
      >
        {`#${itemTag.name}${itemTag.value != null || itemTag.value! === undefined ? `:${itemTag.value}` : ''}`}
      </Link>
    </Badge>
  );
}
