import { Network, initializeAlchemy, Alchemy } from '@alch/alchemy-sdk';
import { createContext, useContext, useState } from 'react';

const settings = {
  apiKey: process.env.NEXT_PUBLIC_KEY_ALCHEMY_MUMBAI, // Replace with your Alchemy API Key.
  network: Network.MATIC_MUMBAI, // Replace with your network.
  maxRetries: 10,
};

interface IAlchemyContext {
  alchemy: Alchemy;
}

export function createCtx<A extends {} | null>() {
  const ctx = createContext<A | undefined>(undefined);
  return [ctx, ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
}

const [AlchemyContext, AlchemyContextProvider] = createCtx<IAlchemyContext>();

interface AlchemyProviderProps {
  children: React.ReactNode;
}

export const AlchemyProvider = ({ children }: AlchemyProviderProps) => {
  const [alchemy] = useState(initializeAlchemy(settings));
  return (
    <AlchemyContextProvider value={{ alchemy }}>
      {children}
    </AlchemyContextProvider>
  );
};

export function useAlchemy() {
  const c = useContext<IAlchemyContext | undefined>(AlchemyContext);
  if (c === undefined)
    throw new Error('useCtx must be inside a Provider with a value');
  return c;
}
