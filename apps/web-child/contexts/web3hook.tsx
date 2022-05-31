import { Web3Provider } from '@ethersproject/providers';
import axios from 'axios';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ethers } from 'ethers';
import AuthDialog from '../components/auth/AuthDialog';
import { useRouter } from 'next/router';
import { useAxios } from '../hooks/axios.hook';
import { UserChild } from '@lib/types/interfaces';

declare global {
  interface Window {
    ethereum: any;
  }
}

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: 'test', // required
    },
  },
};

interface Web3AuthProviderProps {
  children: React.ReactNode;
}

interface IWeb3AuthContext {
  address: string | undefined;
  user: UserChild | undefined;
  status: 'authenticated' | 'unauthenticated' | 'loading';
  provider: Web3Provider | undefined;
  web3Modal: Web3Modal | undefined;
  connectProvider: (providerId: string) => Promise<void>;
  toggleModal: () => void;
  disconnect: () => void;
}

export function createCtx<A extends {} | null>() {
  const ctx = createContext<A | undefined>(undefined);
  return [ctx, ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
}

const [Web3AuthContext, Web3AuthContextProvider] =
  createCtx<IWeb3AuthContext>();

export type AuthStatus =
  | 'hidden'
  | 'not_exist'
  | 'choose_provider'
  | 'connecting_wallet'
  | 'verifying_account';

export const Web3AuthProvider = ({ children }: Web3AuthProviderProps) => {
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>();
  const [accessToken, setAccessToken] = useState<string>();
  const [registerToken, setRegisterToken] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserChild>();
  const [provider, setProvider] = useState<any>();
  const [web3provider, setWeb3Provider] = useState<Web3Provider>();
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>('hidden');
  const myAxios = useAxios();

  useEffect(() => {
    try {
      setWeb3Modal(
        new Web3Modal({
          network: 'mainnet', // optional
          cacheProvider: true,
          providerOptions, // required
          theme: 'dark',
        }),
      );
    } catch (e) {
      console.log('Error while creating Web3Modal');
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem('logged_in')) {
      myAxios.get('/api/auth/children/me').then((res) => {
        setUser(res.data);
      });
    }
  }, [myAxios, accessToken]);

  useEffect(() => {
    if (router.query.token) {
      setRegisterToken(router.query.token as string);
    }
  }, [router]);

  const connectProvider = useCallback(
    async (providerId: string) => {
      const instance = await web3Modal?.connectTo(providerId);
      const provider = new ethers.providers.Web3Provider(instance);
      setProvider(instance);
      setWeb3Provider(provider);
      provider.send('eth_requestAccounts', []).then((accounts) => {
        setAddress(accounts[0]);
      });
    },
    [web3Modal],
  );

  const verifyAccount = useCallback(async () => {
    if (!address || !web3provider) return;

    if (registerToken) {
      await axios
        .post<{ nonce: string }>('/api/metamask/register', {
          token: registerToken,
          walletAddress: address,
        })
        .then((res) => res.data);
    }

    try {
      const nonce = await axios
        .post<{ nonce: string }>('/api/metamask/nonce', {
          walletAddress: address,
        })
        .then((res) => res.data.nonce);
      const signature = await web3provider?.send('personal_sign', [
        nonce,
        address,
      ]);
      const accessToken = await axios
        .post<{ access_token: string }>('/api/metamask/verify', {
          signature: signature,
          walletAddress: address,
        })
        .then((res) => {
          return res.data.access_token;
        });
      setStatus('hidden');
      setAccessToken(accessToken);
      localStorage.setItem('logged_in', 'true');
    } catch (e) {
      // setStatus('hidden');
    }
  }, [address, registerToken, web3provider]);

  const toggleModal = useCallback(() => {
    try {
      setStatus('choose_provider');
    } catch (e) {
      console.log(e);
    }
  }, []);

  const disconnect = useCallback(async () => {
    web3Modal?.clearCachedProvider();
    localStorage.removeItem('logged_in');
    myAxios.post('/api/auth/logout').then(() => {
      setAddress(undefined);
      setUser(undefined);
    });
    // setProvider(undefined);
    // setWeb3Provider(undefined);
  }, [web3Modal, myAxios]);

  useEffect(() => {
    if (address && status === 'verifying_account') {
      verifyAccount();
    }
  }, [address, status, verifyAccount]);

  useEffect(() => {
    if (provider?.on) {
      console.log('bind');
      provider?.on('accountsChanged', disconnect);
    }

    return () => {
      if (provider?.removeListener) {
        console.log('unbind');
        provider?.removeListener('accountsChanged', disconnect);
      }
    };
  }, [provider, disconnect]);

  useEffect(() => {
    if (web3Modal?.cachedProvider) {
      connectProvider(web3Modal.cachedProvider);
    }
  }, [web3Modal, connectProvider]);

  return (
    <Web3AuthContextProvider
      value={{
        web3Modal,
        address,
        user,
        status: loading
          ? 'loading'
          : user
          ? 'authenticated'
          : 'unauthenticated',
        provider: web3provider,
        toggleModal: toggleModal,
        connectProvider: connectProvider,
        disconnect,
      }}
    >
      {children}
      {status !== 'hidden' && (
        <AuthDialog
          status={status}
          setStatus={setStatus}
          connectProvider={connectProvider}
        />
      )}
    </Web3AuthContextProvider>
  );
};

export function useWeb3Auth() {
  const c = useContext<IWeb3AuthContext | undefined>(Web3AuthContext);
  if (c === undefined)
    throw new Error('useCtx must be inside a Provider with a value');
  return c;
}
