import { useEffect, useState } from 'react';

export default function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(handler); //클린업
  }, [value, delay]);
  return debounced;
}
