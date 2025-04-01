import { createAPIFileRoute } from '@tanstack/react-start/api';
import { proxyElectricRequest } from '@quanta/web/lib/electric-proxy';

export const APIRoute = createAPIFileRoute('/api/db/comments/item/$id')({
  GET: async ({ request, params }) => {
    return await proxyElectricRequest(request!, 'comments', {
      where: `"item_id" = '${params.id}'`,
      order: '"created_at" DESC',
    });
  },
});
