import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  const { isConnected, connector, status } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { chain } = useNetwork();
  const { switchNetwork, isLoading: switchNetworkLoading } = useSwitchNetwork();

  const { status: nextAuthStatus, data } = useSession();

  const [reconnecting, setReconnecting] = useState(false);
  const [checkDisconnect, setCheckDisconnect] = useState(false);

  const logout = useMutation(() => disconnectAsync(), {
    onSuccess: async () => {
      queryClient.removeQueries();
      signOut({ callbackUrl: '/connect' });
    },
  });

  useEffect(() => {
    if (!checkDisconnect && nextAuthStatus === 'authenticated') {
      setCheckDisconnect(true);
    }
    if (checkDisconnect && nextAuthStatus === 'unauthenticated') {
      router.push('/connect');
      setCheckDisconnect(false);
    }
  }, [nextAuthStatus, router, checkDisconnect]);

  // // useEffect to match connecting state between wallet/wagmi and next-auth
  // useEffect(() => {
  //   if (
  //     status === 'reconnecting' ||
  //     (status === 'connecting' &&
  //       nextAuthStatus === 'authenticated' &&
  //       reconnecting === false)
  //   ) {
  //     setReconnecting(true);
  //   }
  //   if (
  //     reconnecting &&
  //     status === 'disconnected' &&
  //     nextAuthStatus === 'authenticated' &&
  //     !logout.isLoading
  //   ) {
  //     setReconnecting(false);
  //     logout.mutate();
  //   }
  //   if (status === 'connected' && nextAuthStatus === 'authenticated') {
  //     setReconnecting(false);
  //   }
  // }, [status, reconnecting, nextAuthStatus, logout]);

  // useEffect(() => {
  //   function onDisconnect() {
  //     if (!logout.isLoading) {
  //       logout.mutate();
  //     }
  //   }
  //   function onChange({ account }: { account?: string }) {
  //     if (account) {
  //       onDisconnect();
  //     }
  //   }
  //   if (connector?.id !== 'magic' && nextAuthStatus === 'authenticated') {
  //     connector?.on('disconnect', onDisconnect);
  //     connector?.on('change', onChange);
  //   }
  //   return () => {
  //     if (connector?.id !== 'magic') {
  //       connector?.removeListener('disconnect', onDisconnect);
  //       connector?.removeListener('change', onChange);
  //     }
  //   };
  // }, [logout, connector, nextAuthStatus]);

  // // WE FORCE SWITCH NETWORK HERE
  // useEffect(() => {
  //   if (
  //     nextAuthStatus === 'authenticated' &&
  //     connector?.id !== 'magic' &&
  //     chain &&
  //     !switchNetworkLoading &&
  //     switchNetwork &&
  //     chain.id !== env.CHAIN_ID
  //   )
  //     switchNetwork(env.CHAIN_ID);
  // }, [
  //   chain,
  //   chain?.id,
  //   switchNetwork,
  //   connector,
  //   nextAuthStatus,
  //   switchNetworkLoading,
  // ]);

  return (
    <AuthContextProvider
      value={{
        loggedIn: nextAuthStatus === 'authenticated' && isConnected,
        signOut: async () => logout.mutate(),
        user: data?.user,
      }}
    >
      {children}
    </AuthContextProvider>
  );
};
