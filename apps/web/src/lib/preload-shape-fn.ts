import { createIsomorphicFn } from '@tanstack/react-start';
import { preloadShape } from '@electric-sql/react';

export const preloadShapeFn = createIsomorphicFn().client(async (config) => {
  return await preloadShape(config);
});
