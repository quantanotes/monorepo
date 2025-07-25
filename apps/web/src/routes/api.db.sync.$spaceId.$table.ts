import { createServerFileRoute } from '@tanstack/react-start/server'
import { auth } from '@quanta/auth/server';
import { getSpaceWhereOwner } from '@quanta/web/lib/space-model';
import { proxyElectricRequest } from '@quanta/web/lib/electric-proxy';

export const ServerRoute = createServerFileRoute('/api/db/sync/$spaceId/$table').methods({
  GET: async ({ request, params }) => {
    const spaceId = params.spaceId;
    const table = params.table;

    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const space = await getSpaceWhereOwner(spaceId, session.user.id);
    if (!space) {
      return new Response('Unauthorized', { status: 401 });
    }

    return await proxyElectricRequest(request, table);
  },
});
