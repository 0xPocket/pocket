import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type UseTimerProps = {
  callback: () => Promise<any>;
  delay: number;
};

const INTERVAL = 1000;

export function useTimer({ callback, delay }: UseTimerProps) {
  const router = useRouter();
  const [redirect, setRedirect] = useState(false);
  const [timer, setTimer] = useState<number>(delay);

  const trigger = () => {
    setRedirect(true);
  };

  useEffect(() => {
    if (redirect && timer !== undefined) {
      const timeout = setTimeout(() => {
        if (timer === 1000) {
          setTimer(0);
          callback().then(() => {
            setRedirect(false);
            setTimer(delay);
          });
        } else {
          setTimer((prev) => prev && prev - INTERVAL);
        }
      }, INTERVAL);

      return () => clearTimeout(timeout);
    }
  }, [redirect, timer, router, callback, delay]);

  return {
    active: redirect,
    trigger,
    timer: timer / 1000,
  };
}
