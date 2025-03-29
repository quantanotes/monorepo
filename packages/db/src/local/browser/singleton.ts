import { DB } from '../types';
import { initDB } from './init';

var db: Promise<DB>;

export function getDB(): Promise<DB> {
  if (typeof window === 'undefined') {
    return undefined!;
  }
  if (db) {
    return db;
  }
  db = initDB();
  return db;
}
