import { StickyNote, Sparkles, Hash } from 'lucide-react';
import { Pinned } from '@quanta/types';
import { Button } from '@quanta/ui/button';
import { Link } from '@tanstack/react-router';
// import { ObjectPageMenu } from '@quanta/web/components/object-page-menu';
// import { TagPageMenu } from '@quanta/web/components/tag-page-menu';

interface SidebarPinnedProps {
  pinned: Pinned;
  spaceId?: string;
}

export function SidebarPinned({ pinned }: SidebarPinnedProps) {
  const href = pinned.type === 'item' ? `/${pinned.itemId}` : '/';

  const Icon = () => {
    switch (pinned.type) {
      case 'item':
        return <StickyNote className="size-5" />;
      case 'tag':
        return <Hash className="size-5" />;
      default:
        return <Sparkles className="size-5" />;
    }
  };

  return (
    <div className="group/menu-item relative">
      <Button
        className="text-muted-foreground peer/menu-button h-8 w-full cursor-pointer justify-start truncate px-1.5 text-base"
        variant="ghost"
        asChild
      >
        <Link to={href}>
          <Icon />
          <span className="truncate group-hover/menu-item:mr-8">
            {pinned.name || 'Untitled'}
          </span>
        </Link>
      </Button>

      {/* {item.type === 'object' ? (
        <ObjectPageMenu
          className="peer-hover/menu-button:text-accent-foreground absolute right-1 h-8 w-8 opacity-0 transition-opacity group-hover/menu-item:opacity-100"
          id={item.object_id}
          isPinned={true}
        />
      ) : item.type === 'tag' ? (
        <TagPageMenu
          className="peer-hover/menu-button:text-accent-foreground absolute right-1 h-8 w-8 opacity-0 transition-opacity group-hover/menu-item:opacity-100"
          name={item.name}
          isPinned={true}
        />
      ) : null} */}
    </div>
  );
}
