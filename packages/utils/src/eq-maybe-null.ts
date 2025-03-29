import { eq, isNull } from '@quanta/db/drizzle';

export function eqMaybeNull(col: any, value: any) {
  return value ? eq(col, value) : isNull(col);
}
