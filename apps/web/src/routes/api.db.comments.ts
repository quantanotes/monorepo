import { createAPIFileRoute } from '@tanstack/react-start/api';
import { getSessionFromHeaders } from '@quanta/web/lib/auth';
import { proxyElectricRequest } from '@quanta/web/lib/electric-proxy';

export const APIRoute = createAPIFileRoute('/api/db/comments')({
  GET: async ({ request }) => {
    const session = await getSessionFromHeaders(request.headers);

    // Get query parameters
    const url = new URL(request.url);
    const itemId = url.searchParams.get('itemId');
    const spaceId = url.searchParams.get('spaceId');

    // Build where clause based on provided parameters
    let whereClause = `"user_id" IS NOT NULL`;

    if (itemId) {
      whereClause += ` AND "item_id" = '${itemId}'`;
    }

    if (spaceId) {
      whereClause += ` AND "space_id" = '${spaceId}'`;
    }

    return await proxyElectricRequest(request!, 'comments', {
      where: whereClause,
      order: '"created_at" DESC',
    });
  },
});
