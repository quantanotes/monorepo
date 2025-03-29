import { Mutex } from '@electric-sql/pglite';
import { DB } from './types';

const writeSyncMutex = new Mutex();

export async function startDBSync(db: DB) {}

export async function startWriteSync(db: DB) {}
