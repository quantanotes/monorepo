import { createServerFileRoute } from '@tanstack/react-start/server';
import { assertSessionFromRequest } from '@quanta/web/lib/auth';
import { proxyElectricRequest } from '@quanta/web/lib/electric-proxy';

export const ServerRoute = createServerFileRoute('/api/db/pinned').methods({
  GET: async ({ request }) => {
    const session = await assertSessionFromRequest(request.headers);
    return await proxyElectricRequest(request, 'pinned', {
      where: `user_id = $1`,
      'params[1]': session.user.id,
    });
  },
});
