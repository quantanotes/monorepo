import { useCallback, useLayoutEffect, useRef, useState } from 'react';

type Rect = DOMRectReadOnly;

export function useMeasure<T extends HTMLElement>(): [
  React.RefCallback<T>,
  Rect,
] {
  const [rect, setRect] = useState<Rect>({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0,
    toJSON: () => JSON.stringify(rect),
  });
  const observerRef = useRef<ResizeObserver | null>(null);
  const elementRef = useRef<T | null>(null);

  const ref = useCallback((node: T | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (node) {
      elementRef.current = node;
      observerRef.current = new ResizeObserver(([entry]) => {
        setRect(entry.contentRect);
      });
      observerRef.current.observe(node);
    }
  }, []);

  useLayoutEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return [ref, rect];
}
