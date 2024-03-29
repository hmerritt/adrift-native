import { useEffect, useRef } from 'react';

/**
 * Returns previous value of state.
 */
export const usePrevious = (value: any) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
