import { Link, useNavigate } from '@tanstack/react-router';
import {
  SearchIcon,
  HashIcon,
  SquarePenIcon,
  PlugIcon,
  BrainIcon,
  HomeIcon,
  MessageCircleIcon,
} from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@quanta/ui/sidebar';
import { useSpace } from '@quanta/web/hooks/use-space';
import { useItemModel } from '@quanta/web/contexts/item-model';

interface SidebarMainNavigationProps {
  toggleSearch: () => void;
  toggleRightPanel: () => void;
}

export function SidebarMainNavigation({
  toggleSearch,
  toggleRightPanel,
}: SidebarMainNavigationProps) {
  const space = useSpace();
  const itemModel = useItemModel();
  const navigate = useNavigate();

  const handleCreateItem = async () => {
    const item = await itemModel?.createItem({ name: '', content: '' });
    if (item && space) {
      navigate({
        to: '/s/$spaceId/$itemId',
        params: { spaceId: space.id, itemId: item.id },
      });
    } else if (item) {
      navigate({ to: '/$itemId', params: { itemId: item.id } });
    }
  };

  const items = [
    {
      title: 'Home',
      icon: HomeIcon,
      type: 'link' as const,
      to: space ? '/s/$spaceId' : '/',
      params: space ? { spaceId: space.id } : undefined,
    },
    {
      title: 'Search',
      icon: SearchIcon,
      type: 'action' as const,
      onClick: toggleSearch,
    },
    {
      title: 'Chat',
      icon: MessageCircleIcon,
      type: 'action' as const,
      onClick: toggleRightPanel,
    },
    {
      title: 'Create',
      icon: SquarePenIcon,
      type: 'action' as const,
      onClick: handleCreateItem,
    },
    ...(space
      ? [
          {
            title: 'Tags',
            icon: HashIcon,
            type: 'link' as const,
            to: '/s/$spaceId/tags',
            params: { spaceId: space.id },
          },
          {
            title: 'Tools',
            icon: PlugIcon,
            type: 'link' as const,
            to: '/tools',
          },
          {
            title: 'Tasks',
            icon: BrainIcon,
            type: 'link' as const,
            to: '/tasks',
          },
        ]
      : []),
  ];

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                {item.type === 'link' ? (
                  <Link to={item.to!} params={item.params}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <button onClick={item.onClick}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </button>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
