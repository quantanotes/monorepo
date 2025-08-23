import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  ChevronUpIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
} from 'lucide-react';
import { auth } from '@quanta/auth/client';
import { Avatar, AvatarFallback, AvatarImage } from '@quanta/ui/avatar';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@quanta/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@quanta/ui/dropdown-menu';
import { ProfileSettingsDialog } from '@quanta/web/components/profile-settings-dialog';
import { useAuthDialog } from '@quanta/web/components/auth-dialog';
import { useAuthUser } from '@quanta/web/hooks/use-auth-user';

export function SidebarProfileMenu() {
  const navigate = useNavigate();
  const user = useAuthUser();
  const { setIsOpen: setAuthDialogOpen } = useAuthDialog();
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);

  if (!user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={() => setAuthDialogOpen(true)}>
            <LogOutIcon className="mr-2 size-4" />
            Sign In
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg">
                <Avatar className="size-8">
                  <AvatarImage src={user.image ?? ''} alt={user.username} />
                  <AvatarFallback>
                    {user.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.username}
                  </span>

                  <span className="truncate text-xs">{user.email}</span>
                </div>

                <ChevronUpIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-[17rem]"
              side="top"
              align="start"
              sideOffset={4}
            >
              <div className="flex items-center gap-2 px-2 py-3">
                <Avatar className="h-10 w-10 rounded-lg">
                  <AvatarImage src={user.image ?? ''} alt={user.username} />
                  <AvatarFallback className="rounded-lg">
                    {user.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate font-medium">{user.username}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setIsProfileSettingsOpen(true)}>
                <UserIcon className="mr-2 size-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                onClick={() =>
                  auth
                    .signOut()
                    .then(() => navigate({ to: '/', reloadDocument: true }))
                }
              >
                <LogOutIcon className="mr-2 size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <ProfileSettingsDialog
        open={isProfileSettingsOpen}
        onOpenChange={setIsProfileSettingsOpen}
      />
    </>
  );
}
