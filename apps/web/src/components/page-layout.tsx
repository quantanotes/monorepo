import { ScrollArea } from '@quanta/ui/scroll-area';
import { PageHeader } from '@quanta/web/components/page-header';

export interface PageLayoutProps {
  children?: React.ReactNode;
  title?: string;
  headerMenu?: React.ReactNode;
}

export function PageLayout({
  children,
  title = '',
  headerMenu,
}: PageLayoutProps) {
  return (
    <>
      <PageHeader title={title}>{headerMenu}</PageHeader>
      <ScrollArea className="bg-background h-[calc(100vh-16px-40px)] rounded-lg p-2">
        {children}
      </ScrollArea>
    </>
  );
}
