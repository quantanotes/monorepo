import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from '@tanstack/react-router';
import { type QueryClient } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { z } from 'zod';
import { Toaster } from '@quanta/ui/sonner';
import { DBProvider } from '@quanta/web/contexts/db';
import { SyncProvider } from '@quanta/web/contexts/sync';
import { PinnedProvider } from '@quanta/web/contexts/pinned';
import { ItemModelProvider } from '@quanta/web/contexts/item-model';
import { AuthDialogProvider } from '@quanta/web/components/auth-dialog';
// import { authUserQueryOptions } from '@quanta/web/lib/user';
// import { spaceQueryOptions } from '@quanta/web/lib/space-query';
import { MainLayout } from '@quanta/web/components/main-layout';
import css from '@quanta/ui/styles/globals.css?url';
import favicon from '@quanta/web/public/favicon.ico?url';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Quanta',
      },
    ],

    links: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Manrope:wght@200..800&display=swap',
      },
      {
        rel: 'icon',
        href: favicon,
      },
      {
        rel: 'stylesheet',
        href: css,
      },
    ],
  }),

  loader: async ({ context }) => {
    await Promise.all([
      // context.queryClient.ensureQueryData(authUserQueryOptions()),
      // context.queryClient.ensureQueryData(spaceQueryOptions()),
    ]);
  },

  validateSearch: z.object({ unauthenticated: z.boolean().optional() }),

  component: RootComponent,
});

function RootComponent() {
  const { unauthenticated } = Route.useSearch();
  return (
    <RootDocument>
      <DBProvider>
        <SyncProvider>
          <ItemModelProvider>
            <PinnedProvider>
              <AuthDialogProvider open={!!unauthenticated}>
                <MainLayout>
                  <Outlet />
                </MainLayout>
              </AuthDialogProvider>
            </PinnedProvider>
          </ItemModelProvider>
        </SyncProvider>
      </DBProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: React.PropsWithChildren) {
  return (
    <html className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster />
        <Scripts />
        {/* <TanStackRouterDevtools position="bottom-right" /> */}
        {/* <ReactQueryDevtools buttonPosition="bottom-left" /> */}
      </body>
    </html>
  );
}
