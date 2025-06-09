import { and, eq, ne, or } from '@quanta/db/drizzle';
import { schema } from '@quanta/db/local';
import { TagQuery } from '@quanta/types';

export function flattenItemTagResult<I, T>(result: {
  item: I;
  tags: T[];
  username?: string | null;
}) {
  const tags = (result.tags || [])
    .filter(Boolean)
    .reduce((acc: Record<string, any>, tag: any) => {
      if (tag.name) {
        acc[tag.name] = tag;
      }
      return acc;
    }, {});
  return {
    ...result.item,
    username: result.username,
    tags,
  };
}

export function flattenItemTagResults<I, T>(results: { item: I; tags: T[] }[]) {
  return results.map(flattenItemTagResult);
}

export function makeTagCondition(tag: TagQuery) {
  const tagCondition = eq(schema.tags.name, tag.tag);
  if (tag.operator && tag.value) {
    const withOp = (op) =>
      and(tagCondition, op(schema.itemTags.value, tag.value));
    switch (tag.operator) {
      case '=':
        return withOp(eq);
      case '!=':
        return withOp(ne);
    }
  }
  return tagCondition;
}

export function makeTagFilter(tags: TagQuery[]) {
  return or(...tags.map(makeTagCondition));
}
