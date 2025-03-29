import { createServerFn } from '@tanstack/react-start';
import { redirect } from '@tanstack/react-router';
import { getSessionFromRequestContext } from '@quanta/web/lib/auth';

export const assertSessionFn = createServerFn().handler(async () => {
  const session = await getSessionFromRequestContext();
  if (!session) {
    throw redirect({
      to: '.',
      search: { unauthenticated: true },
    });
  }
  return session;
});
