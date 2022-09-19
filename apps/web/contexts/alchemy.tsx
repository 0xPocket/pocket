import { Alchemy } from 'alchemy-sdk';
import { env } from 'config/env/client';
import { createContext, useContext, useState } from 'react';

const settings = {
  apiKey: env.ALCHEMY_KEY, // Replace with your Alchemy API Key.
  network: env.NETWORK_KEY, // Replace with your network.
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
  const [alchemy] = useState(new Alchemy(settings));
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
