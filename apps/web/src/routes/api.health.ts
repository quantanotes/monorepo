import { createServerFileRoute } from '@tanstack/react-start/server'
import { json } from '@tanstack/react-start';

export const ServerRoute = createServerFileRoute('/api/health').methods({
  GET: async ({ request }) => {
    return json({ ok: true });
  },
});
