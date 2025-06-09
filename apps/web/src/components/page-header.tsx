export interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header className="text-muted-foreground flex h-12 items-center justify-between px-4 py-2">
      <div className="grow truncate">
        <h1>{title}</h1>
      </div>
      <div className="items-left flex flex-1 justify-end gap-2">{children}</div>
    </header>
  );
}
