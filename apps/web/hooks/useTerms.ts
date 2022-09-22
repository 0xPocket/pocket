import { useCallback, useEffect, useState } from 'react';

const LOCAL_STORAGE_KEY = 'terms-accepted';
const VERSION = '1';

export function useTerms() {
  const [accepted, setAccepted] = useState<boolean>(true);

  const accept = useCallback(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, VERSION);
    setAccepted(true);
  }, []);

  useEffect(() => {
    const accepted = localStorage.getItem(LOCAL_STORAGE_KEY) === VERSION;
    setAccepted(accepted);
  }, [accepted]);

  return { accepted, accept };
}
