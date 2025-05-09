import { createAPIFileRoute } from '@tanstack/react-start/api';
import { getSessionFromHeaders } from '@quanta/web/lib/auth';
import { proxyElectricRequest } from '@quanta/web/lib/electric-proxy';

export const APIRoute = createAPIFileRoute('/api/db/pinned')({
  GET: async ({ request }) => {
    const session = await getSessionFromHeaders(request.headers);
    return await proxyElectricRequest(request!, 'pinned', {
      where: `"user_id" = '${session.user.id}'`,
    });
  },
});
