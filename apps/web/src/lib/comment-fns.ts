import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { db } from '@quanta/db/remote';
import { assertSessionFn } from '@quanta/web/lib/auth-fns';
import { CommendModel } from '@quanta/web/lib/comment-model';

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
    const model = new CommendModel(db, data.spaceId ?? null, session.user.id);
    return model.add(data.content, data.itemId);
  });

export const deleteCommentFn = createServerFn()
  .validator(
    z.object({
      id: z.string(),
      spaceId: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await assertSessionFn();
    const model = new CommendModel(db, data.spaceId ?? null, session.user.id);
    return await model.delete(data.id);
  });

export const getItemCommentsFn = createServerFn()
  .validator(
    z.object({
      id: z.string(),
      spaceId: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await assertSessionFn();
    const model = new CommendModel(db, data.spaceId ?? null, session.user.id);
    return await model.getWhereItem(data.id);
  });

export const getSpaceCommentsFn = createServerFn()
  .validator(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await assertSessionFn();
    const model = new CommendModel(db, data.id, session.user.id);
    return model.getWhereSpace();
  });
