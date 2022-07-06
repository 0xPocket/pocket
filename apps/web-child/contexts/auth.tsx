import { UserChild } from '@lib/types/interfaces';
import axios from 'axios';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { SiweMessage } from 'siwe';
import { useAccount, useDisconnect } from 'wagmi';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface IAuthContext {
  loggedIn: boolean;
  getMessage: (address: string, chainId: number) => Promise<SiweMessage>;
  signOut: () => void;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  user: UserChild | undefined;
}

export function createCtx<A extends {} | null>() {
  const ctx = createContext<A | undefined>(undefined);
  return [ctx, ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
}

const [AuthContext, AuthContextProvider] = createCtx<IAuthContext>();

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [showModal, setShowModal] = useState(false);

  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const queryClient = useQueryClient();

  const user = useQuery(
    'user',
    () => axios.get('/api/auth/children/me').then((res) => res.data),
    { refetchOnWindowFocus: false, retry: false },
  );

  const logout = useMutation(() => axios.post('/api/auth/logout'), {
    onMutate: () => {
      disconnect();
    },
    onSuccess: () => {
      queryClient.removeQueries('user');
    },
  });

  const getMessage = useCallback(async (address: string, chainId: number) => {
    const nonceRes = await fetch('/api/auth/ethereum/nonce');

    // Populate a message with SIWE
    return new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Sign this message to access Pocket.',
      uri: window.location.origin,
      version: '1',
      chainId,
      nonce: await nonceRes.text(),
    });
  }, []);

  return (
    <AuthContextProvider
      value={{
        loggedIn: !!user && !!isConnected,
        getMessage,
        signOut: () => logout.mutate(),
        showModal,
        setShowModal,
        user: user.data,
      }}
    >
      {children}
    </AuthContextProvider>
  );
};

export function useAuth() {
  const c = useContext<IAuthContext | undefined>(AuthContext);
  if (c === undefined)
    throw new Error('useCtx must be inside a Provider with a value');
  return c;
}
