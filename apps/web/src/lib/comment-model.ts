import { and, eq, desc } from '@quanta/db/drizzle';
import { db, schema } from '@quanta/db/remote';

export async function addComment(
  userId: string,
  content: string,
  options: { itemId?: string; spaceId?: string },
) {
  const { itemId, spaceId } = options;

  if (!itemId && !spaceId) {
    throw new Error('Comment must have either itemId or spaceId');
  }

  const comment = await db
    .insert(schema.comments)
    .values({
      content,
      userId,
      itemId,
      spaceId,
    })
    .returning();

  return comment[0];
}

export async function deleteComment(userId: string, commentId: string) {
  const comment = await db
    .select()
    .from(schema.comments)
    .where(
      and(
        eq(schema.comments.id, commentId),
        eq(schema.comments.userId, userId),
      ),
    )
    .then((results) => results[0]);

  if (!comment) {
    throw new Error(
      'Comment not found or you do not have permission to delete it',
    );
  }

  await db.delete(schema.comments).where(eq(schema.comments.id, commentId));

  return { success: true };
}

export async function getItemComments(itemId: string) {
  return await db
    .select()
    .from(schema.comments)
    .where(eq(schema.comments.itemId, itemId))
    .orderBy(desc(schema.comments.createdAt));
}

export async function getSpaceComments(spaceId: string) {
  return await db
    .select()
    .from(schema.comments)
    .where(eq(schema.comments.spaceId, spaceId))
    .orderBy(desc(schema.comments.createdAt));
}
