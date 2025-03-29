import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routerWithQueryClient } from '@tanstack/react-router-with-query';
import { QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from '@quanta/web/components/error-boundary';
import { routeTree } from './routes.gen';

export function createRouter() {
  const queryClient = new QueryClient();

  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { queryClient },
      defaultPreload: 'intent',
      scrollRestoration: true,
      defaultErrorComponent: ErrorBoundary,
    }),
    queryClient,
  );
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
