import { useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { StickyNote, Sparkles, Hash } from 'lucide-react';
import { Pinned } from '@quanta/types';
import { Button } from '@quanta/ui/button';
import { SidebarPinnedItemMenu } from '@quanta/web/components/sidebar-pinned-item-menu';
import { SidebarPinnedTagMenu } from '@quanta/web/components/sidebar-pinned-tag-menu';

interface SidebarPinnedProps {
  pinned: Pinned;
  spaceId?: string;
}

export function SidebarPinned({ pinned, spaceId }: SidebarPinnedProps) {
  const href = useMemo(() => {
    let result = '';
    if (spaceId) {
      result += `/s/${spaceId}`;
    }
    if (pinned.type === 'item') {
      result += `/${pinned.itemId}`;
    }
    if (pinned.type === 'tag') {
      result += `/t/${pinned.itemId}`;
    }
    return result;
  }, [pinned.type, pinned.itemId, spaceId]);

  const Icon = () => {
    switch (pinned.type) {
      case 'item':
        return <StickyNote className="size-5!" />;
      case 'tag':
        return <Hash className="size-5!" />;
      default:
        return <Sparkles className="size-5!" />;
    }
  };

  const Menu = () => {
    switch (pinned.type) {
      case 'item':
        return <SidebarPinnedItemMenu />;
      case 'tag':
        return <SidebarPinnedTagMenu />;
      default:
        return <div></div>;
    }
  };

  return (
    <div className="group/menu-item relative">
      <Button
        className="text-muted-foreground peer/menu-button h-8 w-full justify-start truncate text-base"
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

      <Menu className="" />
    </div>
  );
}
