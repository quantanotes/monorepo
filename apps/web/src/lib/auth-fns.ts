import { createServerFn } from '@tanstack/react-start';
import {
  getSessionFromRequestContext,
  throwUnauthenticatedRedirect,
} from '@quanta/web/lib/auth';

export const assertSessionFn = createServerFn().handler(async () => {
  const session = await getSessionFromRequestContext();
  if (!session) {
    throwUnauthenticatedRedirect();
  }
  return session!;
});
