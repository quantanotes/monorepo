import { useMemo } from 'react';
import { useShape } from '@electric-sql/react';
import { useStableSet } from '@quanta/web/hooks/use-stable-set';

type ShapeParams = Parameters<typeof useShape>[0]['params'];

interface UseShapeWithJoinParams<S1, S2> {
  shape1Url: string;
  shape2Url: string;
  getJoinId: (row: S1) => string | undefined;
  mergeRows: (row1: S1, row2: S2 | undefined) => any;
  shape1Params?: Partial<ShapeParams>;
  shape2Params?: Partial<ShapeParams>;
}

export function useShapeWithJoin<
  S1 extends Record<string, any>,
  S2 extends Record<string, any>,
>({
  shape1Url,
  shape2Url,
  getJoinId,
  mergeRows,
  shape1Params = {},
  shape2Params = {},
}: UseShapeWithJoinParams<S1, S2>) {
  const { data: data1 = [] } = useShape<S1>({
    url: shape1Url,
    params: shape1Params,
  });

  const joinIds = useStableSet(
    data1.map(getJoinId).filter((id): id is string => id !== undefined),
  );

  const shape2WhereClause = useMemo(() => {
    const joinCondition = joinIds.length
      ? `(${joinIds.map((id) => `id = ${id}`).join(' OR ')})`
      : '';
    return shape2Params.where
      ? `(${shape2Params.where}) AND ${joinCondition}`
      : joinCondition;
  }, [joinIds, shape2Params.where]);

  const [abortController] = useMemo(() => {
    const controller = new AbortController();
    return [controller, () => controller.abort()];
  }, [shape2WhereClause]);

  const { data: data2 = [] } = useShape<S2>({
    url: shape2Url,
    params: {
      ...shape2Params,
      where: shape2WhereClause,
    },
    signal: abortController.signal,
  });

  return useMemo(() => {
    const data2Map = new Map(data2.map((row) => [row.id, row]));
    return data1.map((row1) =>
      mergeRows(row1, data2Map.get(getJoinId(row1) ?? '')),
    );
  }, [data1, data2, mergeRows, getJoinId]);
}
