import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { assertSessionFn } from '@quanta/web/lib/auth-fns';
import { getSessionFromRequestContext } from '@quanta/web/lib/auth';
import { isItemLiked, toggleLikeItem } from '@quanta/web/lib/like-model';

export const isItemLikedFn = createServerFn()
  .validator(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await getSessionFromRequestContext();
    if (!session) {
      return false;
    } else {
      return await isItemLiked(session.user.id, data.id);
    }
  });

export const toggleLikeItemFn = createServerFn()
  .validator(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await assertSessionFn();
    await toggleLikeItem(session.user.id, data.id);
  });
