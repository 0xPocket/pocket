import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
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

  async function customSignIn(
    ...params: SignInParams
  ): Promise<ReturnType<typeof signIn>> {
    setLoading(true);
    return signIn(params[0], {
      ...params[1],
      redirect: callbackUrl ? true : false,
      callbackUrl: callbackUrl || undefined,
    }).then((res) => {
      if (!res?.ok) {
        toast.error(res?.error);
        setLoading(false);
      } else {
        window.location.href = '/';
      }
      return res;
    });
  }

  return {
    signIn: customSignIn,
    isLoading: loading,
  };
}
