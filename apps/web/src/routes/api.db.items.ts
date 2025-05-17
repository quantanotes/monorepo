import { proxyElectricRequest } from '@quanta/web/lib/electric-proxy';

export const ServerRoute = createServerFileRoute().methods({
  GET: async ({ request }) => {
    return await proxyElectricRequest(request!, 'items', {
      // where: `"user_id" = '${session.user.id}'`,
    });
  },
});
