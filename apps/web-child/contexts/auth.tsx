import { UserChild } from '@lib/types/interfaces';
import { useRouter } from 'next/router';
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
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface IAuthContext {
  loggedIn: boolean;
  signIn: (chainId: number, address: string) => void;
  register: (chainId: number, address: string) => void;
  signOut: () => void;
  signingIn: boolean;
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
  const [signingIn, setSigningIn] = useState(false);
  const router = useRouter();

  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const queryClient = useQueryClient();

  const user = useQuery<UserChild>(
    'user',
    async () => {
      const res = await fetch('/api/auth/children/me');

      if (!res.ok) return;

      return res.json();
    },
    { refetchOnWindowFocus: false },
  );

  const logout = useMutation(
    () => fetch('/api/auth/logout', { method: 'POST' }),
    {
      onMutate: () => {
        disconnect();
      },
      onSuccess: () => {
        queryClient.invalidateQueries('user');
      },
    },
  );

  const signIn = useCallback(
    async (chainId: number, address: string) => {
      if (!address || !chainId) return;
      setSigningIn(true);
      // We get a random nonce from our server
      const nonceRes = await fetch('/api/auth/ethereum/nonce');

      // Populate a message with SIWE
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign this message to access Pocket.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce: await nonceRes.text(),
      });

      // Sign the message

      // Send the signature to the server to verify it
      try {
        const signature = await signMessageAsync({
          message: message.prepareMessage(),
        });

        const verifyRes = await fetch('/api/auth/ethereum/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message, signature }),
        });

        if (!verifyRes.ok) throw new Error('Error verifying message');

        router.reload();
      } catch (e) {
        setSigningIn(false);
      }
    },
    [signMessageAsync, router],
  );

  const register = useCallback(
    async (chainId: number, address: string) => {
      if (!address || !chainId) return;

      setSigningIn(true);
      // We get a random nonce from our server
      const nonceRes = await fetch('/api/auth/ethereum/nonce');

      // Populate a message with SIWE
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign this message to link your wallet.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce: await nonceRes.text(),
      });

      // Sign the message

      // Send the signature to the server to verify it
      try {
        const signature = await signMessageAsync({
          message: message.prepareMessage(),
        });

        const verifyRes = await fetch('/api/auth/ethereum/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            signature,
            token: router.query.token as string,
          }),
        });

        if (!verifyRes.ok) throw new Error('Error verifying message');

        router.push('/');
      } catch (e) {
        setSigningIn(false);
      }
    },
    [signMessageAsync, router],
  );

  return (
    <AuthContextProvider
      value={{
        loggedIn: !!user && !!isConnected,
        signIn,
        signOut: () => logout.mutate(),
        register,
        signingIn,
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
