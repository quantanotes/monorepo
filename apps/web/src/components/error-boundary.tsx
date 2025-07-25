import { useMemo, useCallback } from 'react';
import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/react-router';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { Button } from '@quanta/ui/button';

export function ErrorBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  const handleTryAgain = useCallback(() => {
    router.invalidate();
  }, [router]);

  const handleGoBack = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.history.back();
  }, []);

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-4">
      <ErrorComponent error={error} />
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleTryAgain}>Try Again</Button>
        {isRoot ? (
          <Button asChild>
            <Link to="/">Home</Link>
          </Button>
        ) : (
          <Button onClick={handleGoBack}>Go Back</Button>
        )}
      </div>
    </div>
  );
}
