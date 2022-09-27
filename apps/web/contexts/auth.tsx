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
  const router = useRouter();
  const [reconnect, setReconnect] = useState(false);
  const [loading, setLoading] = useState(false);

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const { status: nextAuthStatus, data } = useSession();
  // const { data, status } = trpc.useQuery(['auth.session'], {
  //   staleTime: 0,
  //   enabled: isConnected && nextAuthStatus === 'authenticated',
  //   retry: false,
  // });

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

  const logout = useMutation<void, unknown, boolean>(() => disconnectAsync(), {
    onSuccess: async (_, redirect) => {
      queryClient.removeQueries();
      signOut({ redirect: false }).then(() => {
        if (redirect) {
          router.push('/connect');
        }
      });
    },
  });

  useEffect(() => {
    function onDisconnect() {
      console.log('onDisconnect');
      logout.mutate(true);
    }
    function onChange({ account }: { account?: string }) {
      console.log('onChange');
      if (
        account &&
        account.toLowerCase() !== data?.user.address?.toLowerCase()
      ) {
        onDisconnect();
      }
    }
    if (connector?.id !== 'magic') {
      connector?.on('disconnect', onDisconnect);
      connector?.on('change', onChange as any);
    }
    return () => {
      if (connector?.id !== 'magic') {
        connector?.removeListener('disconnect', onDisconnect);
        connector?.removeListener('change', onChange as any);
      }
    };
  }, [
    logout,
    connector,
    router,
    queryClient,
    nextAuthStatus,
    data?.user.address,
  ]);

  // RECONNECTING STATE
  // useEffect(() => {
  //   if (
  //     wagmiStatus === 'reconnecting' ||
  //     (wagmiStatus === 'connecting' && !reconnect)
  //   ) {
  //     setLoading(true);
  //     setReconnect(true);
  //     return;
  //   }

  //   if (wagmiStatus === 'connected' && reconnect) {
  //     setReconnect(false);
  //     if (connector.id === 'magic') return magicConnect.mutate();
  //     setLoading(false);
  //   }

  //   if (wagmiStatus === 'disconnected' && reconnect) {
  //     if (nextAuthStatus === 'authenticated') {
  //       logout.mutate(true);
  //     }
  //     setLoading(false);
  //     setReconnect(false);
  //   }
  // }, [
  //   wagmiStatus,
  //   reconnect,
  //   router,
  //   magicConnect,
  //   connector,
  //   logout,
  //   nextAuthStatus,
  // ]);

  // WE GET THE MAGIC CONNECTOR HERE
  useEffect(() => {
    const magic = connectors.find((c) => c.id === 'magic') as MagicConnector;
    if (magic) {
      setMagic(magic);
    }
  }, [connectors]);

  // WE FORCE SWITCH NETWORK HERE
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
        loggedIn:
          nextAuthStatus === 'authenticated' && data?.user && isConnected,
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
