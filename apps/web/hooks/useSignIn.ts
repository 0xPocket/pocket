import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-toastify';

type SignInParams = ['ethereum' | 'magic', Parameters<typeof signIn>[1]];

type UseSignInReturn = {
  signIn: (...params: SignInParams) => Promise<ReturnType<typeof signIn>>;
  isLoading: boolean;
};

export function useSignIn(): UseSignInReturn {
  const [loading, setLoading] = useState(false);

  async function customSignIn(
    ...params: SignInParams
  ): Promise<ReturnType<typeof signIn>> {
    setLoading(true);
    return signIn(...params).then((res) => {
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
