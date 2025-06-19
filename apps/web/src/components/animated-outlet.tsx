import { useContext, useRef } from 'react';
import {
  Outlet,
  getRouterContext,
  useMatch,
  useMatches,
} from '@tanstack/react-router';
import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import { cloneDeep } from 'lodash-es';

export function AnimatedOutlet() {
  const RouterContext = getRouterContext();
  const routerContext = useContext(RouterContext);
  const renderedContext = useRef(routerContext);
  const matches = useMatches();
  const match = useMatch({ strict: false });
  const nextMatchIndex = matches.findIndex((d) => d.id === match.id) + 1;
  const nextMatch = matches[nextMatchIndex];
  const isPresent = useIsPresent();

  if (isPresent) {
    renderedContext.current = cloneDeep(routerContext);
  }

  return (
    <AnimatePresence mode="sync">
      <motion.div
        initial={{ opacity: 0, filter: 'blur(15px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(15px)' }}
        transition={{ duration: 0.1, ease: 'linear' }}
        key={nextMatch.id}
      >
        <RouterContext value={renderedContext.current}>
          <Outlet />
        </RouterContext>
      </motion.div>
    </AnimatePresence>
  );
}
