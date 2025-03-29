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

interface HumanChatItemProps {
  comment: HumanChatComment;
  onDelete: (id: string) => void;
}

export function HumanChatItem({ comment, onDelete }: HumanChatItemProps) {
  const isCurrentUser = comment.userId === 'currentUser';
  const date = new Date(comment.createdAt);
  // Simple time formatter
  const formatTime = () => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 60) return 'just now';

    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60)
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12)
      return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;

    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
  };

  return (
    <div
      className={`flex gap-3 px-4 py-2 ${isCurrentUser ? 'bg-muted/30' : ''}`}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.userAvatar} />
        <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">{comment.userName}</span>
            <span className="text-muted-foreground text-xs">
              {formatTime()}
            </span>
          </div>

          {isCurrentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(comment.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <p className="mt-1 leading-relaxed">{comment.content}</p>
      </div>
    </div>
  );
}
