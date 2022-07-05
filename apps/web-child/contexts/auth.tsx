import { UserChild } from '@lib/types/interfaces';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { SiweMessage } from 'siwe';
import { useAccount, useDisconnect, useNetwork, useSignMessage } from 'wagmi';
import AuthDialog from '../components/auth/AuthDialog';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface IAuthContext {
  loggedIn: boolean;
  signIn: (chainId: number, address: string) => void;
  signOut: () => void;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  user: UserChild | undefined;
}

export function createCtx<A extends {} | null>() {
  const ctx = createContext<A | undefined>(undefined);
  return [ctx, ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
}

const [AuthContext, AuthContextProvider] = createCtx<IAuthContext>();

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<UserChild>();

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain: activeChain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const signIn = useCallback(
    async (chainId: number, address: string) => {
      if (!address || !chainId) return;

      // We get a random nonce from our server
      const nonceRes = await fetch('/api/auth/ethereum/nonce');

      // Populate a message with SIWE
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce: await nonceRes.text(),
      });

      // Sign the message
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      // Send the signature to the server to verify it
      const verifyRes = await fetch('/api/auth/ethereum/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
      });

      if (!verifyRes.ok) throw new Error('Error verifying message');

      setLoggedIn(true);
      setShowModal(false);
    },
    [signMessageAsync],
  );

  const signOut = useCallback(() => {
    fetch('/api/auth/logout', {
      method: 'POST',
    }).then(async () => {
      setLoggedIn(false);
      setUser(undefined);
      disconnect();
    });
  }, [disconnect]);

  useEffect(() => {
    if (isConnected) {
      fetch('/api/auth/children/me').then(async (res) => {
        if (!res.ok) {
          return;
        }
        const user = await res.json();
        setUser(user);
      });
    }
  }, [isConnected]);

  return (
    <AuthContextProvider
      value={{
        loggedIn,
        signIn,
        signOut,
        setShowModal,
        user,
      }}
    >
      {children}
      <AuthDialog show={showModal} setShow={setShowModal} />
    </AuthContextProvider>
  );
};

export function useAuth() {
  const c = useContext<IAuthContext | undefined>(AuthContext);
  if (c === undefined)
    throw new Error('useCtx must be inside a Provider with a value');
  return c;
}
