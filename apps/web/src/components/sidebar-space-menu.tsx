import { useState } from 'react';
import { useNavigate, Link, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { ChevronDownIcon, PlusIcon, EclipseIcon } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@quanta/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@quanta/ui/dropdown-menu';
import { SpaceCreateDialog } from '@quanta/web/components/space-create-dialog';
import { spaceQueryOptions } from '@quanta/web/lib/space-query';
import { useAuthUser } from '@quanta/web/hooks/use-auth-user';

export function SidebarSpaceMenu() {
  const navigate = useNavigate();
  const user = useAuthUser();
  const { data: spaces } = useQuery(spaceQueryOptions());
  const { spaceId } = useParams({ strict: false });
  const [isSpaceCreateOpen, setIsSpaceCreateOpen] = useState(false);

  const currentSpaceName =
    spaces?.find((space) => space.id === spaceId)?.name ?? 'The Hyperspace';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              // size="sm"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full"
            >
              {/*<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <EclipseIcon className="size-4" />
              </div>*/}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{currentSpaceName}</span>
              </div>
              <div className="relative w-3">
                <ChevronDownIcon className="ml-auto size-4" />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="border-border bg-background w-(--radix-dropdown-menu-trigger-width) min-w-60 rounded-lg border p-1 shadow-md"
            side="bottom"
            align="start"
            sideOffset={4}
          >
            {spaces?.map((space) => (
              <DropdownMenuItem key={space.id} asChild>
                <Link to="/s/$spaceId" params={{ spaceId: space.id }}>
                  <EclipseIcon className="mr-2 size-4" />
                  {space.name}
                </Link>
              </DropdownMenuItem>
            ))}

            {spaces && <DropdownMenuSeparator />}

            <DropdownMenuItem asChild>
              <Link to="/">
                <EclipseIcon className="mr-2 size-4" />
                The Hyperspace
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                user
                  ? setIsSpaceCreateOpen(true)
                  : navigate({ search: { unauthenticated: true } });
              }}
            >
              <PlusIcon className="mr-2 size-4" />
              Create Space
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <SpaceCreateDialog
        open={isSpaceCreateOpen}
        onOpenChange={setIsSpaceCreateOpen}
      />
    </SidebarMenu>
  );
}
