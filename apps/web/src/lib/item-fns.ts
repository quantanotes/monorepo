import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { ItemModelRemote } from '@quanta/web/lib/item-model-remote';
import { assertSessionFn } from '@quanta/web/lib/auth-fns';

export const getItemFn = createServerFn()
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const model = new ItemModelRemote('');
    return await model.get(data.id);
  });

export const createItemFn = createServerFn()
  .validator(
    z.object({
      name: z.string(),
      content: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await assertSessionFn();
    const model = new ItemModelRemote(session.user.id);
    return await model.create(data);
  });

export const updateItemWhereUserFn = createServerFn()
  .validator(
    z.object({
      id: z.string(),
      name: z.string(),
      content: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await assertSessionFn();
    const model = new ItemModelRemote(session.user.id);
    return await model.updateWhereUser(data.id, {
      name: data.name,
      content: data.content,
    });
  });

export const deleteItemWhereUserFn = createServerFn()
  .validator(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await assertSessionFn();
    const model = new ItemModelRemote(session.user.id);
    return await model.deleteItemWhereUser(data.id);
  });

export const searchItemFn = createServerFn()
  .validator(
    z.object({
      query: z.string().optional().default(''),
      tags: z.any().optional(),
      limit: z.number().optional().default(100),
      offset: z.number().optional().default(0),
    }),
  )
  .handler(async ({ data }) => {
    const { query, tags, limit, offset } = data;
    const model = new ItemModelRemote('');
    return await model.textSearchItemsWithTags(query, tags, limit, offset);
  });
