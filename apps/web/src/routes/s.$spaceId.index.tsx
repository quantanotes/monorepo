import { useState } from 'react';
import { searchQuerySchema } from '@quanta/web/lib/search';
import { useItemModelLocal } from '@quanta/web/hooks/use-item-model-local';
import { PageLayout } from '@quanta/web/components/page-layout';
import { Query } from '@quanta/web/components/query';
import { ViewMenu } from '@quanta/web/components/view-menu';

export const Route = createFileRoute({
  component: RouteComponent,
  validateSearch: searchQuerySchema,
  ssr: false,
});

function RouteComponent() {
  const { limit, tags = [], query = '', offset } = Route.useSearch();
  const { useSearchItemsLive } = useItemModelLocal()!;
  const [view, setView] = useState('grid');
  const items = useSearchItemsLive(query, tags, limit, offset);

  return (
    <PageLayout
      headerMenu={
        <ViewMenu
          views={['table', 'grid']}
          currentView={view}
          onViewChange={setView}
        />
      }
    >
      <Query items={items} tags={tags.map((tag) => tag.tag)} view={view} />
    </PageLayout>
  );
}
