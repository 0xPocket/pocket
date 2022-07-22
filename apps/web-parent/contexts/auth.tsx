import { UserParent } from '@lib/types/interfaces';
import { OAuthExtension } from '@magic-ext/oauth';
import axios, { AxiosResponse } from 'axios';
import { Magic } from 'magic-sdk';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useAccount, useDisconnect } from 'wagmi';
import { createCtx } from '../utils/createContext';

interface MagicAuthProviderProps {
  children: React.ReactNode;
}

interface IMagicAuthContext {
  loggedIn: boolean;
  signInWithEmail: (email: string) => Promise<AxiosResponse | undefined>;
  signOut: () => Promise<AxiosResponse>;
  magic: Magic<OAuthExtension[]> | undefined;
  user: UserParent | undefined;
}

export const [useMagic, MagicAuthContextProvider] =
  createCtx<IMagicAuthContext>();

export const MagicAuthProvider = ({ children }: MagicAuthProviderProps) => {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [magic, setMagic] = useState<Magic<OAuthExtension[]>>();

  const user = useQuery(
    'user',
    () => axios.get('/api/auth/parents/me').then((res) => res.data),
    { refetchOnWindowFocus: false, retry: false, enabled: isConnected },
  );

  const verifyUser = useMutation((token: string) =>
    axios.post('/api/auth/magic', { token }),
  );

  const logout = useMutation(() => axios.post('/api/auth/logout'), {
    onMutate: () => {
      disconnect();
    },
    onSuccess: () => {
      queryClient.removeQueries('user');
      router.push('/connect');
    },
  });

  useEffect(() => {
    const magic = new Magic('pk_live_4752F69D8DDF4CF5', {
      extensions: [new OAuthExtension()],
      network: {
        rpcUrl: 'http://localhost:8545',
        chainId: 137,
      },
    });
    setMagic(magic);
    magic.preload();
  }, []);

  const signInWithEmail = async (email: string) => {
    try {
      const token = await magic?.auth.loginWithMagicLink({
        email,
      });

      if (!token) {
        throw new Error('No token');
      }

      return verifyUser.mutateAsync(token);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <MagicAuthContextProvider
      value={{
        loggedIn: user && isConnected,
        signInWithEmail,
        signOut: async () => logout.mutateAsync(),
        magic,
        user: user.data,
      }}
    >
      {children}
    </MagicAuthContextProvider>
  );
};
