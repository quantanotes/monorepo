import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { assertSessionFn } from '@quanta/web/lib/auth-fns';
import {
  addComment,
  deleteComment,
  getItemComments,
  getSpaceComments,
} from '@quanta/web/lib/comment-model';

export const addCommentFn = createServerFn()
  .validator(
    z.object({
      content: z.string(),
      itemId: z.string().optional(),
      spaceId: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await assertSessionFn();
    return await addComment(session.user.id, data.content, {
      itemId: data.itemId,
      spaceId: data.spaceId,
    });
  });

export const deleteCommentFn = createServerFn()
  .validator(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await assertSessionFn();
    return await deleteComment(session.user.id, data.id);
  });

export const getItemCommentsFn = createServerFn()
  .validator(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    await assertSessionFn();
    return await getItemComments(data.id);
  });

export const getSpaceCommentsFn = createServerFn()
  .validator(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    await assertSessionFn();
    return await getSpaceComments(data.id);
  });
