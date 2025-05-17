import { Link } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Earth, Plus } from 'lucide-react';
import { spaceQueryOptions } from '@quanta/web/lib/space-query';
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@quanta/ui/dropdown-menu';

interface SpaceListProps {
  onCreateSpace: () => void;
}

export function SpaceList({ onCreateSpace }: SpaceListProps) {
  const { data: spaces } = useSuspenseQuery(spaceQueryOptions());
  return (
    <>
      <DropdownMenuGroup>
        {spaces?.map((space) => (
          <DropdownMenuItem key={space.id} asChild>
            <Link to="/s/$spaceId" params={{ spaceId: space.id }}>
              <Earth />
              {space.name}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuItem asChild>
          <Link to="/">
            <Earth />
            The Hyperspace
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuItem onClick={onCreateSpace}>
        <Plus />
        Create Space
      </DropdownMenuItem>
    </>
  );
}
