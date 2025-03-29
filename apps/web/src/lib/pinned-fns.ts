import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { PinnedModelRemote } from '@quanta/web/lib/pinned-model-remote';
import { assertSessionFn } from '@quanta/web/lib/auth-fns';

export const getPinnedItemsFn = createServerFn().handler(async () => {
  const session = await assertSessionFn();
  return await new PinnedModelRemote(session.user.id).getAll();
});

export const togglePinItemFn = createServerFn()
  .validator(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await assertSessionFn();
    await new PinnedModelRemote(session.user.id).togglePinItem(data.id);
  });
