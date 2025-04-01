import { createAPIFileRoute } from '@tanstack/react-start/api';
import { proxyElectricRequest } from '@quanta/web/lib/electric-proxy';

export const APIRoute = createAPIFileRoute('/api/db/users')({
  GET: async ({ request }) => {
    return await proxyElectricRequest(request!, 'users', {
      columns: 'id,username,discriminator,image',
    });
  },
});
