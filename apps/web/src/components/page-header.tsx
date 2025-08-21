import { useSidebar } from '@quanta/ui/sidebar';
import { QuickMenu } from '@quanta/web/components/quick-menu';

export interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  const { state } = useSidebar();

  return (
    <header className="text-muted-foreground relative flex h-12 items-center px-4 py-2">
      {state === 'expanded' ? <div /> : <QuickMenu />}

      <h1 className="absolute left-1/2 -translate-x-1/2 text-sm">{title}</h1>

      <div className="ml-auto flex items-center gap-1">{children}</div>
    </header>
  );
}
