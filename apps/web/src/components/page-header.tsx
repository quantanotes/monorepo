export interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header className="text-muted-foreground flex h-10 items-center px-1">
      <div className="grow">
        <h1>{title}</h1>
      </div>
      <div className="flex h-10 items-center gap-2">{children}</div>
    </header>
  );
}
