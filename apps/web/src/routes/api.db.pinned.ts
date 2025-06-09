import { assertSessionFromRequest } from '@quanta/web/lib/auth';
import { proxyElectricRequest } from '@quanta/web/lib/electric-proxy';

export const ServerRoute = createServerFileRoute().methods({
  GET: async ({ request }) => {
    const session = await assertSessionFromRequest(request.headers);
    return await proxyElectricRequest(request!, 'pinned', {
      where: `"user_id" = '${session.user.id}'`,
    });
  },
});
