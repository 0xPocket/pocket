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

export function useWeb3Modal() {
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>();

  useEffect(() => {
    if (!web3Modal) {
      try {
        import('web3modal').then((Web3Modal) => {
          setWeb3Modal(
            new Web3Modal.default({
              network: 'mainnet', // optional
              cacheProvider: true,
              providerOptions, // required
              theme: 'dark',
            }),
          );
        });
      } catch (e) {
        console.log('Error while creating Web3Modal');
      }
    }
  }, []);

  return web3Modal;
}

interface Web3AuthProviderProps {
  children: React.ReactNode;
}

interface IWeb3AuthContext {
  address: string | undefined;
  status: 'authenticated' | 'unauthenticated' | 'loading';
  provider: Web3Provider | undefined;
  connect: () => void;
  disconnect: () => void;
}

export function createCtx<A extends {} | null>() {
  const ctx = createContext<A | undefined>(undefined);
  return [ctx, ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
}

const [Web3AuthContext, Web3AuthContextProvider] =
  createCtx<IWeb3AuthContext>();

export const Web3AuthProvider = ({ children }: Web3AuthProviderProps) => {
  const web3Modal = useWeb3Modal();
  const [address, setAddress] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [provider, setProvider] = useState<any>();
  const [web3provider, setWeb3Provider] = useState<Web3Provider>();

  const connect = useCallback(async () => {
    try {
      const instance = await web3Modal?.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      setProvider(instance);
      setWeb3Provider(provider);
      provider.send('eth_requestAccounts', []).then((accounts) => {
        setAddress(accounts[0]);
      });
    } catch (e) {
      console.log(e);
    }
  }, [web3Modal]);

  const disconnect = useCallback(async () => {
    web3Modal?.clearCachedProvider();
    setAddress(undefined);
    // setProvider(undefined);
    // setWeb3Provider(undefined);
  }, [web3Modal]);

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
      connect();
    }
  }, [web3Modal, connect]);

  return (
    <Web3AuthContextProvider
      value={{
        address,
        status: loading
          ? 'loading'
          : address
          ? 'authenticated'
          : 'unauthenticated',
        provider: web3provider,
        connect,
        disconnect,
      }}
    >
      {children}
    </Web3AuthContextProvider>
  );
};

export function useWeb3Auth() {
  const c = useContext<IWeb3AuthContext | undefined>(Web3AuthContext);
  if (c === undefined)
    throw new Error('useCtx must be inside a Provider with a value');
  return c;
}
