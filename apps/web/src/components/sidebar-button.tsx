import { ReactNode } from 'react';
import { cn } from '@quanta/ui/utils/css';
import { Button } from '@quanta/ui/button';

interface SidebarButtonProps {
  icon: ReactNode;
  label?: string;
  variant?: 'icon' | 'wide';
  onClick?: () => void;
  isCollapsed: boolean;
}

export function SidebarButton({
  icon,
  label,
  variant = 'wide',
  onClick,
  isCollapsed,
}: SidebarButtonProps) {
  return (
    <Button
      className={cn(
        'text-muted-foreground size-8 text-base',
        !isCollapsed && variant === 'wide' && 'w-full justify-start',
      )}
      variant="ghost"
      key={isCollapsed.toString()}
      onClick={onClick}
    >
      {icon}
      {!isCollapsed && label}
    </Button>
  );
}
