import { UserParent } from '@lib/types/interfaces';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { createCtx } from '../utils/createContext';
import type { MagicConnector } from '../utils/MagicConnector';

interface MagicAuthProviderProps {
  children: React.ReactNode;
}

interface IMagicAuthContext {
  loggedIn: boolean;
  signInWithEmail: (email: string) => Promise<any>;
  signOut: () => Promise<AxiosResponse>;
  user: UserParent | undefined;
}

export const [useMagic, MagicAuthContextProvider] =
  createCtx<IMagicAuthContext>();

export const MagicAuthProvider = ({ children }: MagicAuthProviderProps) => {
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [magic, setMagic] = useState<MagicConnector>();
  const { connectors, connectAsync } = useConnect();

  console.log(isConnected);
  const user = useQuery(
    'user',
    () => axios.get('/api/auth/parents/me').then((res) => res.data),
    { refetchOnWindowFocus: false, retry: false, enabled: isConnected },
  );

  const verifyMagicUser = useMutation((token: string) =>
    axios.post('/api/auth/magic', { token }),
  );

  const signInWithEmail = useMutation(
    () => connectAsync({ connector: magic }),
    {
      onSuccess: async () => {
        const token = await magic?.getDidToken();
        if (token) {
          return verifyMagicUser.mutateAsync(token).then(() => {
            user.refetch();
          });
        }
      },
    },
  );

  const logout = useMutation(() => axios.post('/api/auth/logout'), {
    onSuccess: async () => {
      await disconnectAsync();
      queryClient.removeQueries();
      router.push('/connect');
    },
  });

  useEffect(() => {
    const magic = connectors.find((c) => c.id === 'magic') as MagicConnector;
    if (magic) {
      setMagic(magic);
    }
  }, [connectors]);

  return (
    <MagicAuthContextProvider
      value={{
        loggedIn: user && isConnected,
        signInWithEmail: async (email: string) => {
          magic?.setUserDetails({ email });
          return signInWithEmail.mutateAsync();
        },
        signOut: async () => logout.mutateAsync(),
        user: user.data,
      }}
    >
      {children}
    </MagicAuthContextProvider>
  );
};
