import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { LogIn, Settings, LogOut } from 'lucide-react';
import { auth } from '@quanta/auth/client';
import { Button } from '@quanta/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@quanta/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@quanta/ui/avatar';
import { useAuthDialog } from '@quanta/web/components/auth-dialog';
import { useAuthUser } from '@quanta/web/hooks/use-auth-user';
import { ProfileSettingsDialog } from '@quanta/web/components/profile-settings-dialog';
import { SpaceList } from '@quanta/web/components/space-list';
import { SpaceCreateDialog } from '@quanta/web/components/space-create-dialog';

interface SidebarFooterProps {
  isCollapsed?: boolean;
}

export function SidebarFooter({ isCollapsed = false }: SidebarFooterProps) {
  const navigate = useNavigate();
  const user = useAuthUser();
  const { setIsOpen: setAuthDialogOpen } = useAuthDialog();
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isSpaceCreateOpen, setIsSpaceCreateOpen] = useState(false);
  const [editSpaceId, setEditSpaceId] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="mt-auto">
        <Button
          variant="ghost"
          className={`text-muted-foreground size-8 text-base ${!isCollapsed && 'w-full justify-start'}`}
          onClick={() => setAuthDialogOpen(true)}
          key={isCollapsed.toString()}
        >
          <LogIn className="size-6!" />
          {!isCollapsed && 'Sign In'}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-auto w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`text-muted-foreground size-8 ${!isCollapsed ? 'w-full justify-start' : 'rounded-full'}`}
            key={isCollapsed.toString()}
          >
            <Avatar className="size-6 text-xs">
              <AvatarImage src={user.image ?? ''} />
              <AvatarFallback>
                {user.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {!isCollapsed && user.username}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-56">
          <SpaceList onCreateSpace={() => setIsSpaceCreateOpen(true)} />

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setIsProfileSettingsOpen(true)}>
            <Settings />
            Profile Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            variant="destructive"
            onClick={() => auth.signOut().then(() => navigate({ to: '/' }))}
          >
            <LogOut />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileSettingsDialog
        open={isProfileSettingsOpen}
        onOpenChange={setIsProfileSettingsOpen}
      />

      <SpaceCreateDialog
        open={isSpaceCreateOpen}
        onOpenChange={setIsSpaceCreateOpen}
      />
    </div>
  );
}
