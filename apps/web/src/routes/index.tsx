import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { itemsQueryOptions } from '@quanta/web/lib/item-query';
import { PageLayout } from '@quanta/web/components/page-layout';
import { Grid } from '@quanta/web/components/grid';

const tagSchema = z.object({
  name: z.string(),
  operator: z.string().optional(),
  value: z.string().optional(),
});

export const Route = createFileRoute('/')({
  validateSearch: z.object({
    query: z.string().optional(),
    tags: z.array(tagSchema).optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps, context }) => {
    await context.queryClient.ensureQueryData(itemsQueryOptions(deps));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  const itemsQuery = useSuspenseQuery(itemsQueryOptions(search));
  return (
    <PageLayout>
      <Grid items={itemsQuery.data} />
    </PageLayout>
  );
}
