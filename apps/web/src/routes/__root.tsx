import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from '@tanstack/react-router';
import { z } from 'zod';
import { Toaster } from '@quanta/ui/sonner';
import { ThemeProvider } from '@quanta/web/contexts/theme';
import { DBProvider } from '@quanta/web/contexts/db';
import { SyncProvider } from '@quanta/web/contexts/sync';
import { PinnedProvider } from '@quanta/web/contexts/pinned';
import { ItemModelProvider } from '@quanta/web/contexts/item-model';
import { TagModelProvider } from '@quanta/web/contexts/tag-model';
import { AiChatProvider } from '@quanta/web/contexts/ai-chat';
import { AuthDialogProvider } from '@quanta/web/components/auth-dialog';
import { MainLayout } from '@quanta/web/components/main-layout';
import { AnimatedOutlet } from '@quanta/web/components/animated-outlet';
import globalCss from '@quanta/ui/styles/globals.css?url';
import favicon from '@quanta/web/public/favicon.ico?url';
import type { QueryClient } from '@tanstack/react-query';

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
        href: globalCss,
      },
    ],
  }),

  validateSearch: z.object({ unauthenticated: z.boolean().optional() }),

  component: RootComponent,
});

function RootComponent() {
  const { unauthenticated } = Route.useSearch();

  return (
    <RootDocument>
      <ThemeProvider>
        <DBProvider>
          <SyncProvider>
            <ItemModelProvider>
              <TagModelProvider>
                <PinnedProvider>
                  <AiChatProvider>
                    <AuthDialogProvider open={!!unauthenticated}>
                      <MainLayout>
                        <AnimatedOutlet />
                      </MainLayout>
                    </AuthDialogProvider>
                  </AiChatProvider>
                </PinnedProvider>
              </TagModelProvider>
            </ItemModelProvider>
          </SyncProvider>
        </DBProvider>
      </ThemeProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: React.PropsWithChildren) {
  return (
    <html>
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
