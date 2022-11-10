import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { useAccount, useDisconnect } from 'wagmi';
import { createCtx } from '../utils/createContext';
import { signOut, useSession } from 'next-auth/react';
import type { CustomSessionUser } from 'next-auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface IAuthContext {
  loggedIn: boolean;
  signOut: UseMutationResult<void, unknown, void, unknown>;
  user: CustomSessionUser | undefined;
}

export const [useAuth, AuthContextProvider] = createCtx<IAuthContext>();

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const queryClient = useQueryClient();

  const { status: nextAuthStatus, data } = useSession();

  const logout = useMutation(() => disconnectAsync(), {
    onSuccess: async () => {
      queryClient.removeQueries();
      signOut({ callbackUrl: '/connect' });
    },
  });

  return (
    <AuthContextProvider
      value={{
        loggedIn: nextAuthStatus === 'authenticated' && isConnected,
        signOut: logout,
        user: data?.user,
      }}
    >
      {children}
    </AuthContextProvider>
  );
};
