import { proxyElectricRequest } from '@quanta/web/lib/electric-proxy';

export const ServerRoute = createServerFileRoute().methods({
  GET: async ({ request, params }) => {
    return await proxyElectricRequest(request!, 'items', {
      where: `"id" = '${params.id}'`,
    });
  },
});
