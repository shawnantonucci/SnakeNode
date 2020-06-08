// Custom Hook by Dan Abramov
import { useEffect, useRef } from 'react';

export function useInterval(callback, delay, paused) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null && !paused) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, paused]);
}