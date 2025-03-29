// import { pick } from 'lodash';
// import { doc } from '@quanta/agent';
// import type { TagType } from '@quanta/types';
// import type { ObjectModel } from '@quanta/web/lib/objects';

// export const db = (objectModel: ObjectModel) => {
//   const filterObject = (obj: any) => {
//     if (!obj) return null;
//     return pick(obj, ['id', 'name', 'content', 'tags']);
//   };

//   const filterObjects = (objects: any[]) => {
//     if (!objects) return [];
//     return objects.map(filterObject);
//   };

//   return {
//     __doc__:
//       'Knowledge base operations for managing objects and their relationships through tags.',

//     get: doc(
//       'db.get',
//       async (id: string) => {
//         const result = await objectModel.get(id);
//         return filterObject(result);
//       },
//       `(id:string): Promise<object|null>
// Get object by ID with its tags
// db.get("doc_123")`,
//     ),

//     create: doc(
//       'db.create',
//       async (data: {
//         name: string;
//         content: string;
//         tags?: Record<string, { value?: any; type?: TagType }>;
//       }) => {
//         const result = await objectModel.create(data);
//         return filterObject(result);
//       },
//       `(data:{name:string, content:string, tags?:{[name]:{ value?, type? }}}): Promise<object>
// Create object with optional tags
// db.create({
//   name: "Task",
//   content: "Details",
//   tags: { priority: { value: "high" } }
// })`,
//     ),

//     update: doc(
//       'db.update',
//       async (
//         id: string,
//         data: {
//           name: string;
//           content: string;
//           tags?: Record<string, { value?: any; type?: TagType }>;
//         },
//       ) => {
//         const result = await objectModel.update(id, data);
//         return filterObject(result);
//       },
//       `(id:string, data:{name:string, content:string, tags?}): Promise<object>
// Update object and its tags
// db.update("doc_123", {
//   name: "Task",
//   content: "New details",
//   tags: { status: "done" }
// })`,
//     ),

//     delete: doc(
//       'db.delete',
//       async (id: string) => objectModel.delete(id),
//       `(id:string): Promise<void>
// Delete object and its tags
// db.delete("doc_123")`,
//     ),

//     tag: doc(
//       'db.tag',
//       async (id: string, name: string, value?: any, type?: TagType) =>
//         objectModel.tag(id, name, value, type),
//       `(id:string, name:string, value?, type?): Promise<void>
// Add/update object tag
// db.tag("doc_123", "priority", "high")
// db.tag("doc_123", "due", "2024-03-20", "date")`,
//     ),

//     untag: doc(
//       'db.untag',
//       async (id: string, name: string) => objectModel.untagByName(id, name),
//       `(id:string, name:string): Promise<void>
// Remove tag from object
// db.untag("doc_123", "priority")`,
//     ),

//     semantic_search: doc(
//       'db.semantic_search',
//       async (query: string, limit?: number) => {
//         if (query === '') query = 'everything';
//         const results = await objectModel.semanticSearch(query, limit);
//         return filterObjects(results);
//       },
//       `(query:string, limit?:number): Promise<object[]>
// Search objects by semantic similarity
// Query must not be empty or it will fail
// db.semantic_search("project docs", 5)`,
//     ),
//   };
// };
