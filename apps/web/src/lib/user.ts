import { createServerFn } from '@tanstack/react-start';
import { eq } from '@quanta/db/drizzle';
import { db, schema } from '@quanta/db/remote';
import { getSessionFromRequestContext } from '@quanta/web/lib/auth';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const authUserQueryOptions = () =>
  queryOptions({
    queryKey: ['auth-user'],
    queryFn: () => getAuthUserDetailsFn(),
  });

export const getAuthUserDetailsFn = createServerFn().handler(async () => {
  const session = await getSessionFromRequestContext();
  if (!session?.user) {
    return null;
  }
  return await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, session.user.id as string))
    .then((results) => results.at(0));
});

export const useAuthUser = () => useQuery(authUserQueryOptions()).data;
