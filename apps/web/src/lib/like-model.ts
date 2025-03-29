import { and, eq } from '@quanta/db/drizzle';
import { db, schema } from '@quanta/db/remote';

export async function isItemLiked(userId: string, itemId: string) {
  return await db
    .select()
    .from(schema.likes)
    .where(
      and(eq(schema.likes.userId, userId), eq(schema.likes.itemId, itemId)),
    )
    .then((results) => results.length > 0);
}

export async function toggleLikeItem(userId: string, itemId: string) {
  const isLiked = await isItemLiked(userId, itemId);
  if (isLiked) {
    await db
      .delete(schema.likes)
      .where(
        and(eq(schema.likes.userId, userId), eq(schema.likes.itemId, itemId)),
      );
  } else {
    await db.insert(schema.likes).values({
      userId,
      itemId,
    });
  }
}
