import { useLiveQuery } from '@electric-sql/pglite-react';
import { snakeToCamlObject } from '@quanta/utils/snake-to-camel';
import { useSpace } from '@quanta/web/hooks/use-space';
import { useDB } from '@quanta/web/contexts/db';
import { TagModel } from '@quanta/web/lib/tag-model';

export function useTagModelLocal() {
  const db = useDB()!;
  const space = useSpace()!;
  const tagModel = new TagModel(db.orm, space.id);

  const useTagLive = (tagName: string) => {
    const { sql, params } = tagModel.getByNameQuery(tagName).toSQL();
    const result = useLiveQuery(sql, params);
    return result?.rows?.map(snakeToCamlObject).at(0);
  };

  const useAllTagsLive = () => {
    const { sql, params } = tagModel.getAllQuery().toSQL();
    const result = useLiveQuery(sql, params);
    return result?.rows?.map(snakeToCamlObject) || [];
  };

  const useTagChildrenLive = (parentTagName: string) => {
    const { sql, params } = tagModel.getChildrenQuery(parentTagName).toSQL();
    const result = useLiveQuery(sql, params);
    return result?.rows?.map(snakeToCamlObject) || [];
  };

  const updateTag = (tagName: string, data: { name: string }) =>
    tagModel.update(tagName, data);

  const deleteTag = (tagName: string) => tagModel.delete(tagName);

  const addChildTag = (parentTagName: string, childTagName: string) =>
    tagModel.addChild(parentTagName, childTagName);

  const removeChildTag = (parentTagName: string, childTagName: string) =>
    tagModel.removeChild(parentTagName, childTagName);

  return {
    useTagLive,
    useAllTagsLive,
    useTagChildrenLive,
    updateTag,
    deleteTag,
    addChildTag,
    removeChildTag,
  };
}
