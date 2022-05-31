import { createContext, useContext } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { UserParentWallet } from '.prisma/client';

interface WalletProviderProps {
  children: React.ReactNode;
}

interface IWalletContext {
  wallet: UserParentWallet | undefined;
}

export function createCtx<A extends {} | null>() {
  const ctx = createContext<A | undefined>(undefined);
  return [ctx, ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
}

const [WalletContext, WalletContextProvider] = createCtx<IWalletContext>();

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const { data: wallet } = useQuery<UserParentWallet>(
    'wallet',
    async () => {
      const res = await axios.get('/api/wallet');
      return res.data;
    },
    {
      retry: false,
      staleTime: 60 * 5 * 1000,
    },
  );

  return (
    <WalletContextProvider
      value={{
        wallet,
      }}
    >
      {children}
    </WalletContextProvider>
  );
};

export function useWallet() {
  const c = useContext<IWalletContext | undefined>(WalletContext);
  if (c === undefined)
    throw new Error('useCtx must be inside a Provider with a value');
  return c;
}
