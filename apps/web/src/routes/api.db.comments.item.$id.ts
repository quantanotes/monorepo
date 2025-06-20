import { createServerFileRoute } from '@tanstack/react-start/server';
import { proxyElectricRequest } from '@quanta/web/lib/electric-proxy';

export const ServerRoute = createServerFileRoute(
  '/api/db/comments/item/$id',
).methods({
  GET: async ({ request, params }) => {
    return await proxyElectricRequest(request, 'comments', {
      where: `item_id = $1 AND space_id IS NULL`,
      order: `created_at DESC`,
      'params[1]': params.id,
    });
  },
});
