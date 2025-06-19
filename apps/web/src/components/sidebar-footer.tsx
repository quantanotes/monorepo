import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { LogIn, Settings, LogOut } from 'lucide-react';
import { auth } from '@quanta/auth/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@quanta/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@quanta/ui/avatar';
import { useAuthUser } from '@quanta/web/hooks/use-auth-user';
import { useAuthDialog } from '@quanta/web/components/auth-dialog';
import { SidebarButton } from '@quanta/web/components/sidebar-button';
import { ProfileSettingsDialog } from '@quanta/web/components/profile-settings-dialog';
import { SpaceList } from '@quanta/web/components/space-list';
import { SpaceCreateDialog } from '@quanta/web/components/space-create-dialog';
import { ThemeToggle } from '@quanta/web/components/theme-toggle';

interface SidebarFooterProps {
  isCollapsed?: boolean;
}

export function SidebarFooter({ isCollapsed = false }: SidebarFooterProps) {
  const navigate = useNavigate();
  const user = useAuthUser();
  const { setIsOpen: setAuthDialogOpen } = useAuthDialog();
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isSpaceCreateOpen, setIsSpaceCreateOpen] = useState(false);
  // const [editSpaceId, setEditSpaceId] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="mt-auto flex w-full flex-col items-center gap-2">
        <ThemeToggle isCollapsed={isCollapsed} />

        <SidebarButton
          icon={<LogIn className="size-6!" />}
          onClick={() => setAuthDialogOpen(true)}
          isCollapsed={isCollapsed}
          label="Sign In"
        />
      </div>
    );
  }

  return (
    <div className="mt-auto flex w-full flex-col items-center gap-2">
      <ThemeToggle isCollapsed={isCollapsed} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarButton
            isCollapsed={isCollapsed}
            icon={
              <Avatar className="size-6! text-xs">
                <AvatarImage src={user.image ?? ''} />
                <AvatarFallback>
                  {user.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            }
            label={user.username}
          />
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
