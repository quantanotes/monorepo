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
      <ScrollArea className="bg-background h-screen rounded-lg">
        <div className="mt-10 mb-96 px-4">{children}</div>
      </ScrollArea>
    </>
  );
}
