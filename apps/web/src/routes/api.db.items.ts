import { createServerFileRoute } from '@tanstack/react-start/server';
import { proxyElectricRequest } from '@quanta/web/lib/electric-proxy';

export const ServerRoute = createServerFileRoute('/api/db/items').methods({
  GET: async ({ request }) => {
    return await proxyElectricRequest(request, 'items', {
      where: `space_id IS NULL`,
    });
  },
});
