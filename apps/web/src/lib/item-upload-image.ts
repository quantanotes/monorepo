import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import { nanoid } from 'nanoid';
import { db, schema } from '@quanta/db/remote';
import { and, eq } from '@quanta/db/drizzle';
import { assertSessionFn } from '@quanta/web/lib/auth-fns';
import { storage } from './storage';

const itemUploadImageFn = createServerFn({})
  .validator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error('Invalid form data');
    }
    const id = data.get('id')?.toString();
    const image = data.get('image') as File;

    if (!id || !image) {
      throw new Error('id and image are required');
    }

    if (image.size > 1024 * 1024 * 5) {
      throw new Error('Max upload size is 5mb');
    }

    return {
      id,
      image,
    };
  })
  .handler(async ({ data }) => {
    const request = getWebRequest();
    const session = await assertSessionFn();
    const userId = session.user.id;

    const [item] = await db
      .select()
      .from(schema.items)
      .where(and(eq(schema.users.id, userId), eq(schema.items.id, data.id)));
    const url = (await file.stat()).

    if (!item) {
      return;
    }

    const file = storage.file(nanoid(12));
    await file.write(data.image);

    await db
      .update(schema.items)
      .set({ imageUrl: url })
      .where(eq(schema.items.id, data.id));
  });
