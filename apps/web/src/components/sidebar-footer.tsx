import { useNavigate } from '@tanstack/react-router';
import { LogIn, Settings } from 'lucide-react';
import { Button } from '@quanta/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@quanta/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@quanta/ui/avatar';
import { useAuthDialog } from '@quanta/web/components/auth-dialog';
import { auth } from '@quanta/auth/client';
import { useAuthUser } from '@quanta/web/lib/user';
import { ProfileSettingsDialog } from './profile-settings-dialog';
import { useState } from 'react';

interface SidebarFooterProps {
  isCollapsed?: boolean;
}

export function SidebarFooter({ isCollapsed = false }: SidebarFooterProps) {
  const navigate = useNavigate();
  const user = useAuthUser();
  const { setIsOpen: setAuthDialogOpen } = useAuthDialog();
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);

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
              <AvatarImage src={user.image ?? ''} />
              <AvatarFallback>
                {user.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={() => setIsProfileSettingsOpen(true)}>
            <Settings />
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => auth.signOut().then(() => navigate({ to: '/' }))}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ProfileSettingsDialog
        open={isProfileSettingsOpen}
        onOpenChange={setIsProfileSettingsOpen}
      />
    </div>
  );
}
