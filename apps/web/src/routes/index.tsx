import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { itemsQueryOptions } from '@quanta/web/lib/item-query';
import { searchQuerySchema } from '@quanta/web/lib/search';
import { PageLayout } from '@quanta/web/components/page-layout';
import { Query } from '@quanta/web/components/query';
import { ViewMenu } from '@quanta/web/components/view-menu';

export const Route = createFileRoute('/')({
  validateSearch: searchQuerySchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps, context }) => {
    await context.queryClient.ensureQueryData(itemsQueryOptions(deps as any));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  const itemsQuery = useSuspenseQuery(itemsQueryOptions(search as any));
  const [view, setView] = useState<string>('grid');
  const tags = search.tags || [];

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
      <Query
        items={itemsQuery.data}
        tags={tags.map((tag) => tag.tag)}
        view={view}
      />
    </PageLayout>
  );
}
