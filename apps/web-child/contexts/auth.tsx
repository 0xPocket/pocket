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
import { useAccount, useNetwork, useSignMessage } from 'wagmi';
import AuthDialog from '../components/auth/AuthDialog';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface IAuthContext {
  loggedIn: boolean;
  signIn: () => void;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export function createCtx<A extends {} | null>() {
  const ctx = createContext<A | undefined>(undefined);
  return [ctx, ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
}

const [AuthContext, AuthContextProvider] = createCtx<IAuthContext>();

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);

  const { address, isConnected } = useAccount();
  const { chain: activeChain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const signIn = useCallback(async () => {
    console.log('sign in');

    const chainId = activeChain?.id;

    if (!address || !chainId) return;

    const nonceRes = await fetch('/api/auth/ethereum/nonce');
    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Sign in with Ethereum to the app.',
      uri: window.location.origin,
      version: '1',
      chainId,
      nonce: await nonceRes.text(),
    });

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

    setLoggedIn(true);
    setShowModal(false);
  }, [address, signMessageAsync, activeChain]);

  useEffect(() => {
    if (isConnected) {
      signIn();
    }
  }, [isConnected, signIn]);

  return (
    <AuthContextProvider
      value={{
        loggedIn,
        signIn,
        setShowModal,
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
