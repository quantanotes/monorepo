import { createServerFileRoute } from '@tanstack/react-start/server';
import { json } from '@tanstack/react-start';
import { snakeToCamel } from '@quanta/utils/snake-to-camel';
import { auth } from '@quanta/auth/server';
import { and, eq } from '@quanta/db/drizzle';
import { tables } from '@quanta/db/local';
import { db, schema } from '@quanta/db/remote';
import { getSpaceWhereOwner } from '@quanta/web/lib/space-model';
import type { TablesRelationalConfig } from '@quanta/db/drizzle';
import type { ChangeSet } from '@quanta/db/local';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core';

export const ServerRoute = createServerFileRoute(
  '/api/db/sync/$spaceId',
).methods({
  POST: async ({ request, params }) => {
    const spaceId = params.spaceId;

    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const space = await getSpaceWhereOwner(spaceId, session.user.id);
    if (!space) {
      return new Response('Unauthorized', { status: 401 });
    }

    const changeSet: ChangeSet = await request.json();
    const results = await Promise.allSettled(
      Object.entries(changeSet).flatMap(([table, rows]) =>
        rows.map(async (row) => {
          try {
            await db.transaction(async (tx) => {
              await applyChangesOnTable(spaceId, table, row, tx);
            });
            return { ok: true, table, row };
          } catch (error) {
            return {
              ok: false,
              table,
              row,
              error: error instanceof Error ? error.message : String(error),
            };
          }
        }),
      ),
    );

    const failures = results
      .map((result) => (result.status === 'fulfilled' ? result.value : null))
      .filter((result) => result !== null && !result.ok);

    return json({ failures });
  },
});

async function applyChangesOnTable<
  X extends PgQueryResultHKT,
  Y extends Record<string, unknown>,
  Z extends TablesRelationalConfig,
>(
  spaceId: string,
  tableName: string,
  row: Record<string, unknown>,
  tx: PgTransaction<X, Y, Z>,
) {
  const tableDef = tables.find((t) => t.schemaName === tableName)!;
  const table = schema[tableName];
  if (!tableDef || !table) {
    throw new Error(`Table definition not found for ${tableName}`);
  }

  const pks = tableDef.primaryKeys;
  const pkConds = and(
    ...pks.map(snakeToCamel).map((pk) => eq(table[pk], row[pk])),
  );

  const spaceIdCond = (other: any) => and(other, eq(table.spaceId, spaceId));

  if (row.isDeleted) {
    return await tx.delete(table).where(spaceIdCond(pkConds));
  } else if (row.isNew) {
    const changes = buildChanges(row, pks);
    changes.spaceId = spaceId;
    return await tx.insert(table).values(changes);
  } else {
    const changes = buildChanges(row);
    changes.spaceId = spaceId;
    return await tx.update(table).set(changes).where(spaceIdCond(pkConds));
  }
}

function buildChanges(row: Record<string, unknown>, pks?: string[]) {
  let modifiedColumns = row.modifiedColumns as string[];

  modifiedColumns = (pks ? [...modifiedColumns, ...pks] : modifiedColumns).map(
    snakeToCamel,
  );

  return Object.keys(row)
    .filter((key) => modifiedColumns.includes(key))
    .reduce(
      (acc, key) => {
        acc[key] = row[key];
        return acc;
      },
      {} as Record<string, unknown>,
    );
}
