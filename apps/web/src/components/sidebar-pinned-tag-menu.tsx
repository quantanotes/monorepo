import { useParams, useNavigate } from '@tanstack/react-router';
import { Pinned } from '@quanta/types';
import { usePinned } from '@quanta/web/contexts/pinned';
import { useTagModelLocal } from '@quanta/web/hooks/use-tag-model-local';
import { TagPageMenu } from '@quanta/web/components/tag-page-menu';

interface SidebarPinnedTagMenuProps {
  pinned: Pinned;
}

export function SidebarPinnedTagMenu({ pinned }: SidebarPinnedTagMenuProps) {
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
      className="peer-hover/menu-button:text-accent-foreground absolute right-1 h-8 w-8 opacity-0 transition-opacity group-hover/menu-item:opacity-100"
      isPinned={true}
      onTogglePin={() => togglePinTag(pinned.name)}
      onDelete={onDeleteTag}
    />
  );
}
