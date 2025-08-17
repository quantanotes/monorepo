import { SidebarTrigger } from '@quanta/ui/sidebar';

export interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header className="text-muted-foreground flex h-12 items-center justify-between px-4 py-2">
      <div className="flex grow items-center gap-4 truncate">
        <SidebarTrigger />
        <h1 className="text-sm">{title}</h1>
      </div>
      <div className="items-left flex flex-1 justify-end gap-1">{children}</div>
    </header>
  );
}
