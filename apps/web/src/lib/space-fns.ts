import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { db } from '@quanta/db/remote';
import { assertSessionFn } from '@quanta/web/lib/auth-fns';
import { createSpaceSchema } from '@quanta/web/lib/space';
import {
  getAllSpaces,
  createSpace,
  deleteSpaceInTx,
  getSpaceOwnerInTx,
  getSpaceWhereOwner,
} from '@quanta/web/lib/space-model';

export const getAllSpacesFn = createServerFn().handler(async () => {
  const session = await assertSessionFn();
  return getAllSpaces(session.user.id);
});

export const createSpaceFn = createServerFn()
  .validator(createSpaceSchema)
  .handler(async ({ data }) => {
    const session = await assertSessionFn();
    return createSpace(session.user.id, data.name);
  });

export const deleteSpaceFn = createServerFn()
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await assertSessionFn();
    await db.transaction(async (tx) => {
      const owner = await getSpaceOwnerInTx(tx, data.id);
      if (owner.userId !== session.user.id) {
        throw new Response('Unauthorized', {
          status: 401,
        });
      }
      await deleteSpaceInTx(tx, data.id);
    });
  });

export const assertAuthenticatedUserSpaceOwnerFn = createServerFn()
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await assertSessionFn();
    const space = await getSpaceWhereOwner(data.id, session.user.id);
    if (!space) {
      throw new Response('Unauthorized', {
        status: 401,
      });
    }
    return space;
  });
