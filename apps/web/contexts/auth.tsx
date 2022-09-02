import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { createCtx } from '../utils/createContext';
import type { MagicConnector } from '../utils/MagicConnector';
import { signIn, signOut, useSession } from 'next-auth/react';
import type { CustomSessionUser } from 'next-auth';
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

interface MagicAuthProviderProps {
  children: React.ReactNode;
}

interface IMagicAuthContext {
  loggedIn: boolean;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  user: CustomSessionUser | undefined;
}

export const [useMagic, MagicAuthContextProvider] =
  createCtx<IMagicAuthContext>();

export const MagicAuthProvider = ({ children }: MagicAuthProviderProps) => {
  const { isConnected, status: wagmiStatus, address, connector } = useAccount();
  const { disconnectAsync, disconnect } = useDisconnect();
  const queryClient = useQueryClient();
  const [magic, setMagic] = useState<MagicConnector>();
  const { connectors, connectAsync } = useConnect();
  const { status: nextAuthStatus } = useSession();
  const { data, status } = trpc.useQuery(['auth.session'], {
    staleTime: 0,
    enabled: isConnected && nextAuthStatus === 'authenticated',
    retry: false,
  });
  const router = useRouter();
  const [reconnect, setReconnect] = useState(false);
  const [loading, setLoading] = useState(false);

  const magicConnect = useMutation(async () => magic?.getDidToken(), {
    onSuccess: async (didToken) => {
      signIn('magic', {
        token: didToken,
        redirect: false,
      }).then(async (res) => {
        if (res?.ok) {
          await router.push('/onboarding');
        } else {
          toast.error(res?.error);
          disconnect();
        }
        setLoading(false);
      });
    },
  });

  const logout = useMutation(() => disconnectAsync(), {
    onSuccess: async () => {
      queryClient.removeQueries();
      signOut({ redirect: false }).then(() => {
        router.push('/connect');
      });
    },
  });

  // CHANGE ACCOUNT DISCONNECT
  useEffect(() => {
    if (
      data &&
      data.user.address &&
      address &&
      address?.toLowerCase() !== data?.user.address.toLowerCase()
    ) {
      logout.mutate();
    }
  }, [address, data, router, logout]);

  // RECONNECTING STATE
  useEffect(() => {
    if (wagmiStatus === 'reconnecting' && !reconnect) {
      setLoading(true);
      setReconnect(true);
      return;
    }

    if (wagmiStatus === 'connected' && reconnect) {
      setReconnect(false);
      if (connector.id === 'magic') return magicConnect.mutate();
      setLoading(false);
    }

    if (wagmiStatus === 'disconnected' && reconnect) {
      logout.mutate();
      setLoading(false);
      setReconnect(false);
    }
  }, [wagmiStatus, reconnect, router, magicConnect, connector, logout]);

  // WE GET THE MAGIC CONNCETOR HERE
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
        loading: logout.isLoading || loading,
        signInWithEmail: async (email: string) => {
          setLoading(true);
          if (isConnected) {
            await disconnectAsync();
          }
          magic?.setUserDetails({ email });
          return connectAsync({ connector: magic }).then(() => {
            return magicConnect.mutate();
          });
        },
        signOut: async () => logout.mutate(),
        user: data?.user,
      }}
    >
      {children}
    </MagicAuthContextProvider>
  );
};
