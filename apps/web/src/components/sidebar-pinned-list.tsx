import { usePinned } from '@quanta/web/contexts/pinned';
import { SidebarPinned } from '@quanta/web/components/sidebar-pinned';

interface SidebarPinnedListProps {
  isCollapsed: boolean;
}

export function SidebarPinnedList({ isCollapsed }: SidebarPinnedListProps) {
  const { pinned } = usePinned();

  if (isCollapsed) {
    return <></>;
  }

  return (
    <div className="flex flex-col">
      {pinned.map((pinned) => (
        <SidebarPinned key={pinned.id} pinned={pinned} />
      ))}
    </div>
  );
}
