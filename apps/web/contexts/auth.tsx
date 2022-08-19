import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { createCtx } from '../utils/createContext';
import type { MagicConnector } from '../utils/MagicConnector';
import { signIn as signInNextAuth, signOut } from 'next-auth/react';
import type { CustomSessionUser } from 'next-auth';
import { trpc } from '../utils/trpc';

interface MagicAuthProviderProps {
  children: React.ReactNode;
}

interface IMagicAuthContext {
  loggedIn: boolean;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<unknown>;
  signOut: () => Promise<void>;
  user: CustomSessionUser | undefined;
}

export const [useMagic, MagicAuthContextProvider] =
  createCtx<IMagicAuthContext>();

export const MagicAuthProvider = ({ children }: MagicAuthProviderProps) => {
  const { isConnected, status: wagmiStatus } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const queryClient = useQueryClient();
  const [magic, setMagic] = useState<MagicConnector>();
  const { connectors, connectAsync } = useConnect();
  const { data, status } = trpc.useQuery(['auth.me'], {
    cacheTime: 60000,
    staleTime: 0,
    enabled: isConnected,
    retry: false,
  });
  const [reconnect, setReconnect] = useState(false);

  const signInWithEmail = useMutation(
    () => connectAsync({ connector: magic }).catch(),
    {
      onSettled: async () => {
        const token = await magic?.getDidToken();
        if (token) {
          return signInNextAuth('magic', { token, callbackUrl: '/' });
        }
      },
    },
  );

  const logout = useMutation(() => disconnectAsync(), {
    onSuccess: async () => {
      queryClient.removeQueries();
      signOut({ callbackUrl: '/connect' });
    },
  });

  useEffect(() => {
    if (wagmiStatus === 'reconnecting' && !reconnect) {
      setReconnect(true);
      return;
    }

    if (wagmiStatus === 'disconnected' && reconnect) {
      signOut();
      setReconnect(false);
    }
  }, [wagmiStatus, reconnect]);

  useEffect(() => {
    const magic = connectors.find((c) => c.id === 'magic') as MagicConnector;
    if (magic) {
      setMagic(magic);
    }
  }, [connectors]);

  return (
    <MagicAuthContextProvider
      value={{
        loggedIn: status === 'success' && data.user && isConnected,
        loading:
          logout.isLoading || signInWithEmail.isLoading || logout.isLoading,
        signInWithEmail: async (email: string) => {
          if (!isConnected) {
            await disconnectAsync();
          }
          magic?.setUserDetails({ email });
          return signInWithEmail.mutateAsync();
        },
        signOut: async () => logout.mutateAsync(),
        user: data?.user,
      }}
    >
      {children}
    </MagicAuthContextProvider>
  );
};
