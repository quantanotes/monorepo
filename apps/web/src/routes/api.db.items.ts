import { createAPIFileRoute } from '@tanstack/react-start/api';
import { proxyElectricRequest } from '@quanta/web/lib/electric-proxy';

export const APIRoute = createAPIFileRoute('/api/db/items')({
  GET: async ({ request }) => {
    return await proxyElectricRequest(request!, 'items', {
      // where: `"user_id" = '${session.user.id}'`,
    });
  },
});
