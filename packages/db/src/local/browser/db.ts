import { initDB } from './init';
import type { DB } from '../types';

var db: Promise<DB>;

export function getDB(): Promise<DB> {
  if (typeof window === 'undefined') {
    return (async () => null as unknown as DB)();
  }

  if (!db) {
    db = initDB();
  }

  return db;
}
