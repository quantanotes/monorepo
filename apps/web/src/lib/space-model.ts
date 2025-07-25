import { eq, and } from '@quanta/db/drizzle';
import { db, schema } from '@quanta/db/remote';
import { Space } from '@quanta/types';

export async function getAllSpaces(userId: string) {
  return (await db
    .select({ ...schema.spaces, role: schema.members.role } as any)
    .from(schema.spaces)
    .leftJoin(schema.members, eq(schema.members.spaceId, schema.spaces.id))
    .where(eq(schema.members.userId, userId))) as unknown as Space[];
}

export async function createSpace(userId: string, name: string) {
  await db.transaction(async (tx) => {
    const [{ id: spaceId }] = await tx
      .insert(schema.spaces)
      .values({ name })
      .returning({ id: schema.spaces.id });
    await tx.insert(schema.members).values({ userId, spaceId, role: 'owner' });
  });
}

export async function getSpaceWhereOwner(spaceId: string, userId: string) {
  const [space] = await db
    .select()
    .from(schema.spaces)
    .leftJoin(schema.members, eq(schema.members.spaceId, schema.spaces.id))
    .where(
      and(
        eq(schema.spaces.id, spaceId),
        eq(schema.members.userId, userId),
        eq(schema.members.role, 'owner'),
      ),
    );
  return space.spaces;
}

export async function getSpaceOwnerInTx(tx: any, spaceId: string) {
  const [member] = await tx
    .select()
    .from(schema.members)
    .where(
      and(
        eq(schema.members.spaceId, spaceId),
        eq(schema.members.role, 'owner'),
      ),
    );
  return member;
}

export async function deleteSpaceInTx(tx: any, spaceId: string) {
  await tx.delete(schema.spaces).where(eq(schema.spaces.id, spaceId));
}
