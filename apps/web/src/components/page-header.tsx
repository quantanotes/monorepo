export interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header className="text-muted-foreground flex h-10 items-center px-1">
      <div className="flex grow gap-3">
        <h1>{title}</h1>
      </div>
      <div className="flex gap-3">{children}</div>
    </header>
  );
}
