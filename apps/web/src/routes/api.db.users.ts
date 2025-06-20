import { createServerFileRoute } from '@tanstack/react-start/server'
import { proxyElectricRequest } from '@quanta/web/lib/electric-proxy';

export const ServerRoute = createServerFileRoute('/api/db/users').methods({
  GET: async ({ request }) => {
    return await proxyElectricRequest(request!, 'users', {
      columns: 'id,username,discriminator,image',
    });
  },
});
