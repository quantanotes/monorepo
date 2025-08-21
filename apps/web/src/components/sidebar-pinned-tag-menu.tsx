import { useParams, useNavigate } from '@tanstack/react-router';
import { MoreHorizontal } from 'lucide-react';
import { SidebarMenuAction } from '@quanta/ui/sidebar';
import { TagPageMenu } from '@quanta/web/components/tag-page-menu';
import { usePinned } from '@quanta/web/contexts/pinned';
import { useTagModelLocal } from '@quanta/web/hooks/use-tag-model-local';
import type { Pinned } from '@quanta/types';

interface SidebarPinnedTagMenuProps {
  className?: string;
  pinned: Pinned;
}

export function SidebarPinnedTagMenu({
  className,
  pinned,
}: SidebarPinnedTagMenuProps) {
  const navigate = useNavigate();
  const { togglePinTag } = usePinned();
  const { deleteTag } = useTagModelLocal();
  const { tagName, spaceId } = useParams({ strict: false });

  const onDeleteTag = () => {
    if (tagName === pinned.name) {
      if (spaceId) {
        navigate({ to: '/s/$spaceId', params: { spaceId } });
      } else {
        navigate({ to: '/' });
      }
    }
    deleteTag(pinned.name);
  };

  return (
    <TagPageMenu
      tagName={pinned.name}
      isPinned={true}
      onTogglePin={() => togglePinTag(pinned.tagId)}
      onDelete={onDeleteTag}
      trigger={
        <SidebarMenuAction className={className}>
          <MoreHorizontal className="size-4" />
        </SidebarMenuAction>
      }
    />
  );
}
