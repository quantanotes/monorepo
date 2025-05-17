import axios from 'axios';
import { and, eq } from 'drizzle-orm';
import { Mutex } from '@electric-sql/pglite';
import { snakeToCamel } from '@quanta/utils/snake-to-camel';
import { tables, type TableDefinition } from './tables';
import type { DB, ChangeSet } from './types';

const writeSyncMutex = new Mutex();

export async function startDBSync(db: DB, spaceId: string) {
  await Promise.all(tables.map((table) => syncTable(db, spaceId, table)));
  startWriteSync(db, spaceId);
}

export function waitForSync(db: DB, spaceId: string) {
  return new Promise((resolve, reject) =>
    db.live
      .query(
        'SELECT * FROM sync_status WHERE is_synced = TRUE AND space_id = $1;',
        [spaceId],
      )
      .then((query) => {
        query.subscribe((result) => {
          if (result.rows.length === tables.length) {
            resolve(undefined);
          }
        });
      })
      .catch(reject),
  );
}

async function syncTable(
  db: DB,
  spaceId: string,
  { table, primaryKeys, columns, jsonColumns }: TableDefinition,
) {
  const result = await db.query(
    'INSERT INTO sync_status (table_name, space_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;',
    [table, spaceId],
  );

  if (!result.affectedRows) {
    return;
  }

  await db.electric.syncShapeToTable({
    shape: {
      url: `${process.env.PUBLIC_APP_URL}/api/db/sync/${spaceId}/${table}`,
      params: {
        columns,
      },
    },
    table,
    primaryKey: primaryKeys,
    useCopy: true,
    onInitialSync: () =>
      db.query(
        'UPDATE sync_status SET is_synced = $1 WHERE table_name = $2 AND space_id = $3;',
        [true, table, spaceId],
      ),
    mapColumns: ({ value }) => {
      const result = {
        ...value,
        ...jsonColumns?.reduce(
          (acc, column) => ({
            ...acc,
            [column]: mapJSON(value[column]),
          }),
          {},
        ),
      };
      return result;
    },
    shapeKey: spaceId + ':' + table,
  });
}

async function startWriteSync(db: DB, spaceId: string) {
  await waitForSync(db, spaceId);

  let query = tables
    .map(
      ({ table }) => `(
        SELECT COUNT(*) as ${table}_count
        FROM ${table}
        WHERE is_synced = false
        AND space_id = '${spaceId}'
      )`,
    )
    .join(',');
  query = `SELECT ${query}`;

  db.live.query(query, [], async (results) => {
    const counts = results.rows[0];
    const count = Object.values(counts).reduce((acc, curr) => (acc += curr), 0);
    if (count > 0) {
      await writeSyncMutex.acquire();
      try {
        syncWrites(db, spaceId);
      } finally {
        writeSyncMutex.release();
      }
    }
  });
}

async function syncWrites(db: DB, spaceId: string) {
  let changeSet: ChangeSet = {};

  await db.orm.transaction(async (tx) => {
    changeSet = (
      await Promise.all(
        tables.map(async ({ schema, schemaName }) => {
          const rows = await tx
            .select()
            .from(schema)
            .where(
              and(
                eq(schema.isSynced, false),
                eq(schema.isSent, false),
                eq(schema.spaceId, spaceId),
              ),
            );
          return { [schemaName]: rows };
        }),
      )
    ).reduce((acc, curr) => ({ ...acc, ...curr }), {} as ChangeSet);
  });

  if (Object.values(changeSet).flat().length === 0) {
    return;
  }

  const res = await axios.post(`/api/db/sync/${spaceId}`, changeSet);
  if (res.status !== 200) {
    throw new Error('Failed to send change set to server.');
  }

  await db.orm.transaction(async (tx) => {
    await tx.execute('SET LOCAL electric.bypass_triggers = true');

    await Promise.all(
      Object.entries(changeSet).flatMap(async ([schemaName, changes]) => {
        const tableDef = tables.find(
          (table) => table.schemaName === schemaName,
        )!;
        const table = tableDef.schema;
        const pks = tableDef.primaryKeys;
        return changes.map(async (change) => {
          const pkConds = pks
            .map(snakeToCamel)
            .map((pk) => eq(table[pk], change[pk]));
          await tx
            .update(table)
            .set({ isSent: true })
            .where(and(...pkConds, eq(table.updatedAt, change.updatedAt)));
        });
      }),
    );
  });
}

function mapJSON(value: string) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return `"${value}"`;
  }
}
