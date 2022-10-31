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
  const [timer, setTimer] = useState<number>(initialTimer);

  const trigger = () => {
    setRedirect(true);
  };

  useEffect(() => {
    if (redirect && timer) {
      const timeout = setTimeout(() => {
        if (timer === INTERVAL) {
          setRedirect(false);
          setTimer(initialTimer);
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
    timer: timer / 1000,
  };
}
