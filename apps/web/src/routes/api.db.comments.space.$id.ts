import { createAPIFileRoute } from '@tanstack/react-start/api';
import { proxyElectricRequest } from '@quanta/web/lib/electric-proxy';

export const APIRoute = createAPIFileRoute('/api/db/comments/space/$id')({
  GET: async ({ request, params }) => {
    const spaceId = params.id === 'null' ? null : params.id;
    const whereClause = spaceId
      ? `"space_id" = '${spaceId}'`
      : `"space_id" IS NULL`;
    return await proxyElectricRequest(request!, 'comments', {
      where: whereClause,
      order: '"created_at" DESC',
    });
  },
});
