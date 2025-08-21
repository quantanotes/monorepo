import { useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { StickyNote, Sparkles, Hash } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton } from '@quanta/ui/sidebar';
import { SidebarPinnedItemMenu } from '@quanta/web/components/sidebar-pinned-item-menu';
import { SidebarPinnedTagMenu } from '@quanta/web/components/sidebar-pinned-tag-menu';
import type { Pinned } from '@quanta/types';

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
      result += `/t/${pinned.name}`;
    }
    return result;
  }, [pinned.type, pinned.itemId, pinned.name, spaceId]);

  const Icon = () => {
    switch (pinned.type) {
      case 'item':
        return <StickyNote className="size-4" />;
      case 'tag':
        return <Hash className="size-4" />;
      default:
        return <Sparkles className="size-4" />;
    }
  };

  const Menu = () => {
    switch (pinned.type) {
      case 'item':
        return (
          <SidebarPinnedItemMenu
            // className="opacity-0 transition-opacity group-hover/item:opacity-100"
            pinned={pinned}
          />
        );
      case 'tag':
        return (
          <SidebarPinnedTagMenu
            // className="opacity-0 transition-opacity group-hover/item:opacity-100"
            pinned={pinned}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SidebarMenuItem className="group/item relative">
      <SidebarMenuButton asChild>
        <Link to={href}>
          <Icon />
          <span className="truncate">{pinned.name || 'Untitled'}</span>
        </Link>
      </SidebarMenuButton>
      <Menu />
    </SidebarMenuItem>
  );
}
