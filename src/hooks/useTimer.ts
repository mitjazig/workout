import { useCallback, useEffect, useRef, useState } from 'react';

export function useTimer(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(
    (value?: number) => {
      clear();
      setRunning(false);
      setSeconds(value ?? initialSeconds);
    },
    [clear, initialSeconds],
  );

  const start = useCallback(() => setRunning(true), []);
  const pause = useCallback(() => setRunning(false), []);

  useEffect(() => {
    if (!running) {
      clear();
      return;
    }

    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clear();
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return clear;
  }, [running, clear]);

  useEffect(() => {
    reset(initialSeconds);
  }, [initialSeconds, reset]);

  const finished = seconds === 0;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${minutes}:${secs.toString().padStart(2, '0')}`;

  return { seconds, display, running, finished, start, pause, reset };
}
