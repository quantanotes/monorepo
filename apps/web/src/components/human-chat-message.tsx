import { MoreHorizontal, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@quanta/ui/avatar';
import { Button } from '@quanta/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@quanta/ui/dropdown-menu';
import type { HumanChatComment } from '@quanta/web/contexts/human-chat';
import { useAuthUser } from '@quanta/web/lib/user';

interface HumanChatMessageProps {
  comment: HumanChatComment;
  onDelete: (id: string) => void;
}

export function HumanChatMessage({ comment, onDelete }: HumanChatMessageProps) {
  const user = useAuthUser();
  const isCurrentUser = comment.userId === user?.id;
  const date = new Date(comment.createdAt);
  return (
    <div className="group hover:bg-muted/50 flex gap-4 px-4 py-4">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={comment.image} />
        <AvatarFallback>
          {comment.username ? comment.username.charAt(0).toUpperCase() : ''}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-foreground text-sm font-medium">
            {comment.username}
          </span>
          <span className="text-muted-foreground text-xs">
            {formatTime(date)}
          </span>
          {isCurrentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 opacity-0 group-hover:opacity-100"
                >
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onDelete(comment.id)}
                  variant="destructive"
                >
                  <Trash2 />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="mt-1">
          <p className="text-foreground leading-relaxed">{comment.content}</p>
        </div>
      </div>
    </div>
  );
}

function formatTime(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) return 'just now';

  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins}m`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo`;

  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears}y`;
}
