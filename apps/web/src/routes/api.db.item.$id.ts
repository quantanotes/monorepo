import { createServerFileRoute } from '@tanstack/react-start/server';
import { proxyElectricRequest } from '@quanta/web/lib/electric-proxy';

export const ServerRoute = createServerFileRoute('/api/db/item/$id').methods({
  GET: async ({ request, params }) => {
    return await proxyElectricRequest(request, 'items', {
      where: `id = $1`,
      'params[1]': params.id,
    });
  },
});
