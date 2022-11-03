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
          console.log(res);
          if (res.url) {
            router.push(res.url);
          }
        }
        return res;
      });
    },
    [router],
  );

  return {
    signIn: customSignIn,
    isLoading: loading,
  };
}
