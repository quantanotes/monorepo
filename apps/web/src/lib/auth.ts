import { getWebRequest } from '@tanstack/react-start/server';
import { redirect } from '@tanstack/react-router';
import { auth } from '@quanta/auth/server';

export function throwUnauthenticatedRedirect() {
  const { headers } = getWebRequest();
  const url = new URL(headers.get('referer')).pathname || '/';
  throw redirect({
    to: url,
    search: { unauthenticated: true },
  });
}

export async function getSessionFromHeaders(headers: Headers) {
  const session = await auth.api.getSession({ headers });
  return session;
}

export function getSessionFromRequestContext() {
  const { headers } = getWebRequest()!;
  return getSessionFromHeaders(headers);
}

export async function assertSessionFromRequest(headers: Headers) {
  const session = await getSessionFromHeaders(headers);
  if (!session) {
    throwUnauthenticatedRedirect();
  }
  return session!;
}
