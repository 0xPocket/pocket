import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type SignInParams = ['ethereum' | 'magic', Parameters<typeof signIn>[1]];

type UseSignInReturn = {
  signIn: (...params: SignInParams) => Promise<ReturnType<typeof signIn>>;
  isLoading: boolean;
};

export function useSignIn(): UseSignInReturn {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [callbackUrl, setCallbackUrl] = useState('');

  useEffect(() => {
    if (router.query.callbackUrl) {
      setCallbackUrl(router.query.callbackUrl as string);
    }
  }, [router.query.callbackUrl]);

  const customSignIn = useCallback(
    async (...params: SignInParams): Promise<ReturnType<typeof signIn>> => {
      setLoading(true);
      return signIn(params[0], {
        ...params[1],
        redirect: false,
      }).then(async (res) => {
        if (!res?.ok) {
          toast.error(res?.error);
          setLoading(false);
        } else {
          window.location.href = callbackUrl;
        }
        return res;
      });
    },
    [callbackUrl],
  );

  return {
    signIn: customSignIn,
    isLoading: loading,
  };
}
