import { proxyElectricRequest } from '@quanta/web/lib/electric-proxy';

export const ServerRoute = createServerFileRoute().methods({
  GET: async ({ request, params }) => {
    return await proxyElectricRequest(request, 'comments', {
      where: `"item_id" = '${params.id}' AND space_id IS NULL`,
      order: '"created_at" DESC',
    });
  },
});
