export function streamToAsyncIterableStream<T>(
  stream: ReadableStream<T>,
): AsyncIterable<T> & ReadableStream<T> {
  const asyncIterable = {
    [Symbol.asyncIterator]() {
      const reader = stream.getReader();

      return {
        async next() {
          const { done, value } = await reader.read();
          return { done, value };
        },

        async return() {
          reader.releaseLock();
          return { done: true, value: undefined };
        },
      };
    },
  };

  return Object.assign(stream, asyncIterable);
}
