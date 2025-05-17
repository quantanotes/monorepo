import { json } from '@tanstack/react-start';

export const ServerRoute = createServerFileRoute().methods({
  GET: async ({ request }) => {
    return json({ ok: true });
  },
});
