import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { createCtx } from '../utils/createContext';
import { signOut, useSession } from 'next-auth/react';
import type { CustomSessionUser } from 'next-auth';
import { useRouter } from 'next/router';
import { env } from 'config/env/client';

interface MagicAuthProviderProps {
  children: React.ReactNode;
}

interface IMagicAuthContext {
  loggedIn: boolean;
  loading: boolean;
  signOut: (redirect?: boolean) => Promise<void>;
  user: CustomSessionUser | undefined;
}

export const [useMagic, MagicAuthContextProvider] =
  createCtx<IMagicAuthContext>();

export const MagicAuthProvider = ({ children }: MagicAuthProviderProps) => {
  const { isConnected, connector } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [loading] = useState(false);

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

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
        loggedIn: nextAuthStatus === 'authenticated' && isConnected,
        loading: logout.isLoading || loading,
        signOut: async (redirect = true) => logout.mutate(redirect),
        user: data?.user,
      }}
    >
      {children}
    </MagicAuthContextProvider>
  );
};
