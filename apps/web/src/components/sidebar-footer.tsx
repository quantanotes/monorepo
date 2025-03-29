import { useNavigate } from '@tanstack/react-router';
import { LogIn } from 'lucide-react';
import { Button } from '@quanta/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@quanta/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@quanta/ui/avatar';
import { useAuthDialog } from '@quanta/web/components/auth-dialog';
import { auth } from '@quanta/auth/client';
import { useAuthUser } from '@quanta/web/lib/user';

interface SidebarFooterProps {
  isCollapsed?: boolean;
}

export function SidebarFooter({ isCollapsed = false }: SidebarFooterProps) {
  const navigate = useNavigate();
  const user = useAuthUser();
  const { setIsOpen: setAuthDialogOpen } = useAuthDialog();

  if (!user) {
    return (
      <div className="mt-auto">
        <Button
          variant="ghost"
          className={`text-muted-foreground size-10 px-1.5! ${!isCollapsed && 'w-full justify-start'}`}
          onClick={() => setAuthDialogOpen(true)}
        >
          <LogIn className="size-6!" />
          {!isCollapsed && 'Sign In'}
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`text-muted-foreground size-10 px-1.5! ${!isCollapsed && 'w-full justify-start'}`}
          >
            <Avatar className="size-8 text-xs">
              <AvatarFallback></AvatarFallback>
            </Avatar>
            {/* {!collapsed && (
              <div className="flex grow items-center">
                <div className="grow text-start">The Hyperspace</div>
                <ChevronUp className="opacity-50" />
              </div>
            )} */}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {/* <DropdownMenuLabel>Spaces</DropdownMenuLabel> */}
          {/* {spaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => setActiveSpace e(workspace)}
            >
              <span>{workspace.name}</span>
              {workspace.id === activeSpace.id && (
                <span className="text-muted-foreground ml-auto text-xs">
                  Active
                </span>
              )}
            </DropdownMenuItem>
          ))} */}
          {/* <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCreateWorkspace}>
            <Plus />
            Create Space
          </DropdownMenuItem>
          <DropdownMenuSeparator /> */}
          <DropdownMenuItem
            variant="destructive"
            onClick={() => auth.signOut().then(() => navigate({ to: '/' }))}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
