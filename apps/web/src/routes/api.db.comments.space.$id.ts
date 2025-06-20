import { createServerFileRoute } from '@tanstack/react-start/server';
import { proxyElectricRequest } from '@quanta/web/lib/electric-proxy';

export const ServerRoute = createServerFileRoute(
  '/api/db/comments/space/$id',
).methods({
  GET: async ({ request, params }) => {
    const spaceId = params.id === 'null' ? null : params.id;
    const whereClause = spaceId
      ? `space_id = $1`
      : `space_id IS NULL AND item_id IS NULL`;
    return await proxyElectricRequest(request!, 'comments', {
      where: whereClause,
      order: 'created_at DESC',
      //@ts-ignore
      'params[1]': spaceId,
    });
  },
});
