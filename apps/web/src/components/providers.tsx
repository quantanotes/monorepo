import { ThemeProvider } from '@quanta/web/contexts/theme';
import { DBProvider } from '@quanta/web/contexts/db';
import { SyncProvider } from '@quanta/web/contexts/sync';
import { PinnedProvider } from '@quanta/web/contexts/pinned';
import { ItemModelProvider } from '@quanta/web/contexts/item-model';
import { TagModelProvider } from '@quanta/web/contexts/tag-model';
import { AiChatProvider } from '@quanta/web/contexts/ai-chat';

export function Providers({ children }: React.PropsWithChildren) {
  return (
    // <ThemeProvider>
    <DBProvider>
      <SyncProvider>
        <ItemModelProvider>
          <TagModelProvider>
            <PinnedProvider>
              <AiChatProvider>{children}</AiChatProvider>
            </PinnedProvider>
          </TagModelProvider>
        </ItemModelProvider>
      </SyncProvider>
    </DBProvider>
    // </ThemeProvider>
  );
}
