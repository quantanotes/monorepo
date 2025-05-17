import { createServerFn } from '@tanstack/react-start';
import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import { eq } from '@quanta/db/drizzle';
import { db, schema } from '@quanta/db/remote';
import { getSessionFromRequestContext } from '@quanta/web/lib/auth';
import { assertSessionFn } from '@quanta/web/lib/auth-fns';

export const authUserQueryOptions = () =>
  queryOptions({
    queryKey: ['auth-user'],
    queryFn: () => getAuthUserDetailsFn(),
  });

export const getAuthUserDetailsFn = createServerFn().handler(async () => {
  const session = await getSessionFromRequestContext();
  if (!session?.user?.id) {
    return null;
  }
  return await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, session.user.id))
    .then((results) => results.at(0));
});

export const updateUsernameFn = createServerFn()
  .validator(z.object({ username: z.string() }))
  .handler(async ({ data }) => {
    const session = await assertSessionFn();
    await db
      .update(schema.users)
      .set({ username: data.username })
      .where(eq(schema.users.id, session.user.id));
  });
