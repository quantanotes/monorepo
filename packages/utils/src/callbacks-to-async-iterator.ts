export function callbacksToAsyncIterator<T>(
  callbackFn: (
    yielder: (item: T) => void,
    breaker: () => void,
  ) => Promise<void>,
): AsyncGenerator<T, void, void> {
  const queue: T[] = [];
  let done = false;
  let resolver: (() => void) | null = null;

  const yielder = (item: T) => {
    queue.push(item);
    if (resolver) {
      resolver();
      resolver = null;
    }
  };

  const breaker = () => {
    done = true;
    if (resolver) {
      resolver();
      resolver = null;
    }
  };

  const callbackPromise = callbackFn(yielder, breaker);

  return (async function* () {
    while (!done || queue.length > 0) {
      if (queue.length > 0) {
        yield queue.shift()!;
      } else {
        await new Promise<void>((resolve) => {
          resolver = resolve;
        });
      }
    }
    await callbackPromise;
  })();
}
