// import {
// 	integer,
// 	pgTable,
// 	primaryKey,
// 	timestamp,
// 	bigint
// } from 'drizzle-orm/pg-core';
// import { objects } from './space';
// import { bytea, nanoidCol } from './helpers';

// export const textOperations = pgTable('text_operations', {
// 	id: integer().primaryKey().generatedAlwaysAsIdentity(),
// 	objectId: nanoidCol().references(() => objects.id, {
// 		onDelete: 'cascade'
// 	}),
// 	data: bytea().notNull()
// });

// export const textAwareness = pgTable(
// 	'text_awareness',
// 	{
// 		clientId: bigint({ mode: 'number' }).notNull(),
// 		objectId: nanoidCol().references(() => objects.id, {
// 			onDelete: 'cascade'
// 		}),
// 		data: bytea().notNull(),
// 		updatedAt: timestamp().defaultNow()
// 	},
// 	(t) => ({
// 		pk: primaryKey({ columns: [t.clientId, t.objectId] })
// 	})
// );
