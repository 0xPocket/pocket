import { useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { createCtx } from '../utils/createContext';
import { signOut, useSession } from 'next-auth/react';
import type { CustomSessionUser } from 'next-auth';
import { useRouter } from 'next/router';
import { env } from 'config/env/client';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface IAuthContext {
  loggedIn: boolean;
  signOut: () => Promise<void>;
  user: CustomSessionUser | undefined;
}

export const [useAuth, AuthContextProvider] = createCtx<IAuthContext>();

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isConnected, connector } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { chain } = useNetwork();
  const { switchNetwork, isLoading: switchNetworkLoading } = useSwitchNetwork();

  const { status: nextAuthStatus, data } = useSession();

  const logout = useMutation<void, unknown, boolean>(() => disconnectAsync(), {
    onSuccess: async () => {
      queryClient.removeQueries();
      signOut();
    },
  });

  useEffect(() => {
    function onDisconnect() {
      logout.mutate(true);
    }
    function onChange({ account }: { account?: string }) {
      if (
        account &&
        account.toLowerCase() !== data?.user.address?.toLowerCase()
      ) {
        onDisconnect();
      }
    }
    if (connector?.id !== 'magic') {
      connector?.on('disconnect', onDisconnect);
      connector?.on('change', onChange);
    }
    return () => {
      if (connector?.id !== 'magic') {
        connector?.removeListener('disconnect', onDisconnect);
        connector?.removeListener('change', onChange);
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

  // WE FORCE SWITCH NETWORK HERE
  useEffect(() => {
    if (
      nextAuthStatus === 'authenticated' &&
      connector?.id !== 'magic' &&
      chain &&
      !switchNetworkLoading &&
      switchNetwork &&
      chain.id !== env.CHAIN_ID
    )
      switchNetwork(env.CHAIN_ID);
  }, [
    chain,
    chain?.id,
    switchNetwork,
    connector,
    nextAuthStatus,
    switchNetworkLoading,
  ]);

  return (
    <AuthContextProvider
      value={{
        loggedIn: nextAuthStatus === 'authenticated' && isConnected,
        signOut: async (redirect = true) => logout.mutate(redirect),
        user: data?.user,
      }}
    >
      {children}
    </AuthContextProvider>
  );
};
