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
import { AuthDialogProvider } from '@quanta/web/components/auth-dialog';
import { MainLayout } from '@quanta/web/components/main-layout';
import { PinnedProvider } from '@quanta/web/contexts/pinned';
import { authUserQueryOptions } from '@quanta/web/lib/user';
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
        href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
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
    await context.queryClient.ensureQueryData(authUserQueryOptions());
  },

  validateSearch: z.object({ unauthenticated: z.boolean().optional() }),

  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: React.PropsWithChildren) {
  const { unauthenticated } = Route.useSearch();
  return (
    <html className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <DBProvider>
          <AuthDialogProvider open={!!unauthenticated}>
            <PinnedProvider>
              <MainLayout>{children}</MainLayout>
            </PinnedProvider>
          </AuthDialogProvider>
        </DBProvider>
        <Toaster />
        <Scripts />
        {/* <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" /> */}
      </body>
    </html>
  );
}
