import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { createCtx } from '../utils/createContext';
import type { MagicConnector } from '../utils/MagicConnector';
import { signIn, signOut } from 'next-auth/react';
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
  signInWithEmail: (email: string) => Promise<string | undefined>;
  signOut: () => Promise<void>;
  user: CustomSessionUser | undefined;
}

export const [useMagic, MagicAuthContextProvider] =
  createCtx<IMagicAuthContext>();

export const MagicAuthProvider = ({ children }: MagicAuthProviderProps) => {
  const { isConnected, status: wagmiStatus } = useAccount();
  const { disconnectAsync, disconnect } = useDisconnect();
  const queryClient = useQueryClient();
  const [magic, setMagic] = useState<MagicConnector>();
  const { connectors, connectAsync } = useConnect();
  const { data, status, refetch } = trpc.useQuery(['auth.session'], {
    staleTime: 0,
    enabled: isConnected,
    retry: false,
  });
  const router = useRouter();
  const [reconnect, setReconnect] = useState(false);

  const signInWithEmail = useMutation(
    async () => {
      await connectAsync({ connector: magic });
      return magic?.getDidToken();
    },
    {
      onSuccess: (token) => {
        signIn('magic', {
          token,
          redirect: false,
        }).then(async (res) => {
          if (res?.ok) {
            // await refetch();
            router.push('/onboarding');
          } else {
            toast.error(res?.error);
            disconnect();
          }
        });
      },
    },
  );

  const logout = useMutation(() => disconnectAsync(), {
    onSuccess: async () => {
      queryClient.removeQueries();
      signOut({ redirect: false }).then(() => {
        router.push('/connect');
      });
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
          if (isConnected) {
            await disconnectAsync();
          }
          magic?.setUserDetails({ email });
          return signInWithEmail.mutateAsync();
        },
        signOut: async () => logout.mutate(),
        user: data?.user,
      }}
    >
      {children}
    </MagicAuthContextProvider>
  );
};
