export function debounce<X extends unknown[], Y>(
  fn: (...args: X) => Y,
  duration: number,
) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: unknown, ...args: X) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), duration);
  };
}
