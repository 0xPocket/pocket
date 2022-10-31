import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type UseAutoRedirectProps = {
  callbackUrl: string;
  initialTimer: number;
};

const INTERVAL = 1000;

export function useAutoRedirect({
  callbackUrl,
  initialTimer,
}: UseAutoRedirectProps) {
  const router = useRouter();
  const [redirect, setRedirect] = useState(false);
  const [timer, setTimer] = useState<number | undefined>(undefined);

  const trigger = () => {
    setRedirect(true);
    setTimer(initialTimer);
  };

  useEffect(() => {
    if (redirect && timer) {
      const timeout = setTimeout(() => {
        if (timer === INTERVAL) {
          setRedirect(false);
          setTimer(undefined);
          router.push(callbackUrl);
        } else {
          setTimer((prev) => prev && prev - INTERVAL);
        }
      }, INTERVAL);

      return () => clearTimeout(timeout);
    }
  }, [redirect, timer, router, callbackUrl, initialTimer]);

  return {
    trigger,
    timer: timer ? timer / 1000 : undefined,
  };
}
