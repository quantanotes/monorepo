import { useEffect, useRef } from 'react';

type FrameCallback = (deltaTime: number) => void;

export function useFrame(callback: FrameCallback, enabled: boolean = true) {
  const callbackRef = useRef(callback);
  const lastTimeRef = useRef(performance.now());
  const frameIdRef = useRef(0);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const loop = (time: number) => {
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;
      callbackRef.current(deltaTime);
      frameIdRef.current = requestAnimationFrame(loop);
    };

    frameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
    };
  }, [enabled]);
}
