import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { db } from '@quanta/db/remote';
import { PinnedModel } from '@quanta/web/lib/pinned-model';
import { assertSessionFn } from '@quanta/web/lib/auth-fns';

export const getPinnedItemsFn = createServerFn().handler(async () => {
  const session = await assertSessionFn();
  const model = new PinnedModel(db, null, session.user.id);
  return await model.getAll();
});

export const togglePinItemFn = createServerFn()
  .validator(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await assertSessionFn();
    const model = new PinnedModel(db, null, session.user.id!);
    await model.togglePinItem(data.id);
  });
