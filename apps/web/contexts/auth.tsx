import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from 'wagmi';
import { createCtx } from '../utils/createContext';
import type { MagicConnector } from '../utils/MagicConnector';
import { signIn, signOut, useSession } from 'next-auth/react';
import type { CustomSessionUser } from 'next-auth';
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { env } from 'config/env/client';

interface MagicAuthProviderProps {
  children: React.ReactNode;
}

interface IMagicAuthContext {
  loggedIn: boolean;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: (redirect?: boolean) => Promise<void>;
  user: CustomSessionUser | undefined;
}

export const [useMagic, MagicAuthContextProvider] =
  createCtx<IMagicAuthContext>();

export const MagicAuthProvider = ({ children }: MagicAuthProviderProps) => {
  const { isConnected, status: wagmiStatus, connector } = useAccount();
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

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const logout = useMutation<void, unknown, boolean>(() => disconnectAsync(), {
    onSuccess: async (_, redirect) => {
      console.log('on success');
      queryClient.removeQueries();
      signOut({ redirect: false }).then(() => {
        if (redirect) {
          router.push('/connect');
        }
        console.log('sign out');
      });
    },
  });

  useEffect(() => {
    function onDisconnect() {
      logout.mutate(true);
    }
    if (connector?.id !== 'magic' && nextAuthStatus === 'authenticated') {
      connector?.on('disconnect', onDisconnect);
      connector?.on('change', onDisconnect);
    }
    return () => {
      if (connector?.id !== 'magic' && nextAuthStatus === 'authenticated') {
        connector?.removeListener('disconnect', onDisconnect);
        connector?.removeListener('change', onDisconnect);
      }
    };
  }, [logout, connector, router, queryClient, nextAuthStatus]);

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
      logout.mutate(true);
      setLoading(false);
      setReconnect(false);
    }
  }, [wagmiStatus, reconnect, router, magicConnect, connector, logout]);

  // WE GET THE MAGIC CONNECTOR HERE
  useEffect(() => {
    const magic = connectors.find((c) => c.id === 'magic') as MagicConnector;
    if (magic) {
      setMagic(magic);
    }
  }, [connectors]);

  useEffect(() => {
    if (
      connector?.id !== 'magic' &&
      chain &&
      switchNetwork &&
      chain.id !== env.CHAIN_ID
    )
      switchNetwork(env.CHAIN_ID);
  }, [chain, chain?.id, switchNetwork, connector]);

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
        signOut: async (redirect = true) => logout.mutate(redirect),
        user: data?.user,
      }}
    >
      {children}
    </MagicAuthContextProvider>
  );
};
