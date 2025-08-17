import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  Outlet,
} from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getCookie, setCookie } from '@tanstack/react-start/server';
import { z } from 'zod';
import { Toaster } from '@quanta/ui/sonner';
import { authUserQueryOptions } from '@quanta/web/lib/user';
import { Providers } from '@quanta/web/components/providers';
import { AuthDialogProvider } from '@quanta/web/components/auth-dialog';
import { MainLayout } from '@quanta/web/components/main-layout';
import { MarketingPage } from '@quanta/web/components/marketing';
import globalCss from '@quanta/ui/styles/globals.css?url';
import favicon from '@quanta/web/public/favicon.ico?url';
import type { QueryClient } from '@tanstack/react-query';

const isFirstVisitFn = createServerFn().handler(({}) => {
  const isFirstVisit = getCookie('is-first-visit') !== undefined;
  if (!isFirstVisit) {
    setCookie('is-first-visit', 'yes');
  }
  return isFirstVisit;
});

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
        href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Victor+Mono:ital,wght@0,100..700;1,100..700&display=swap',
      },
      {
        rel: 'icon',
        href: favicon,
      },
      {
        rel: 'stylesheet',
        href: globalCss,
      },
    ],
  }),

  validateSearch: z.object({ unauthenticated: z.boolean().optional() }),

  component: RootComponent,

  loader: async ({ context }) => {
    const [user, isFirstVisit] = await Promise.all([
      context.queryClient.ensureQueryData(authUserQueryOptions()),
      isFirstVisitFn(),
    ]);
    return {
      user,
      isFirstVisit,
    };
  },
});

function RootComponent() {
  const { unauthenticated } = Route.useSearch();
  const { user, isFirstVisit } = Route.useLoaderData();
  const showMarketingPage = !user && isFirstVisit;

  return (
    <RootDocument>
      <Providers>
        <AuthDialogProvider open={!!unauthenticated}>
          {showMarketingPage && false ? (
            <MarketingPage />
          ) : (
            <MainLayout>
              <Outlet />
            </MainLayout>
          )}
        </AuthDialogProvider>
      </Providers>
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
      </body>
    </html>
  );
}
