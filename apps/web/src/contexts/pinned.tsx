import { createContext, useContext } from 'react';
import { useSpace } from '@quanta/web/hooks/use-space';
import { useAuthUser } from '@quanta/web/hooks/use-auth-user';
import { usePinnedRemote } from '@quanta/web/hooks/use-pinned-remote';
import { usePinnedLocal } from '@quanta/web/hooks/use-pinned-local';

type PinnedContextType =
  | ReturnType<typeof usePinnedRemote>
  | ReturnType<typeof usePinnedLocal>;

// TODO: open auth dialog when toggleitemPin
const PinnedContext = createContext<PinnedContextType>({
  pinned: [],
  isItemPinned: (id: string) => false,
  togglePinItem: async (id: string) => void 0,
});

export function PinnedProvider({ children }: React.PropsWithChildren) {
  const user = useAuthUser();
  const space = useSpace();

  if (!user) {
    return <>{children}</>;
  } else if (space) {
    return <PinnedLocalProvider>{children}</PinnedLocalProvider>;
  } else {
    return <PinnedRemoteProvider>{children}</PinnedRemoteProvider>;
  }
}

function PinnedRemoteProvider({ children }: React.PropsWithChildren) {
  const pinned = usePinnedRemote();

  return <PinnedContext value={pinned}>{children}</PinnedContext>;
}

function PinnedLocalProvider({ children }: React.PropsWithChildren) {
  const pinned = usePinnedLocal();

  return <PinnedContext value={pinned}>{children}</PinnedContext>;
}

export function usePinned() {
  const context = useContext(PinnedContext);
  if (context === null) {
    throw new Error('usePinned must be used within a PinnedProvider');
  }
  return context;
}
