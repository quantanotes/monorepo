import { createAPIFileRoute } from '@tanstack/react-start/api';
import { proxyElectricRequest } from '@quanta/web/lib/electric-proxy';

export const APIRoute = createAPIFileRoute('/api/db/item/$id')({
  GET: async ({ request, params }) => {
    return await proxyElectricRequest(request!, 'items', {
      where: `"id" = '${params.id}'`,
    });
  },
});
