import { pgTable } from 'drizzle-orm/pg-core';
import { spaces } from './tenant';
import { users } from './users';
import { personaColumns } from '../../shared';

export const persona = pgTable('persona', personaColumns(spaces, users));
