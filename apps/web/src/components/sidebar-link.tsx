import { Button } from '@quanta/ui/button';
import { cn } from '@quanta/ui/utils/css';
import { Link } from '@tanstack/react-router';
import { ReactNode } from 'react';

interface SidebarLinkProps {
  href: string;
  params?: Record<string, string>;
  icon: ReactNode;
  variant?: 'wide' | 'icon';
  label: string;
  isCollapsed: boolean;
}

export function SidebarLink({
  href,
  params,
  icon,
  variant = 'wide',
  label,
  isCollapsed,
}: SidebarLinkProps) {
  return (
    <Button
      className={cn(
        'text-muted-foreground size-8 text-base',
        !isCollapsed && variant === 'wide' && 'w-full justify-start',
      )}
      variant="ghost"
      key={isCollapsed.toString()}
      asChild
    >
      <Link href={href} params={params}>
        {icon}
        {!isCollapsed && label}
      </Link>
    </Button>
  );
}
