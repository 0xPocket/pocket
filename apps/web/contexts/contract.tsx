import { createContext, useContext, useMemo } from 'react';
import { useContractRead, useToken } from 'wagmi';
import { env } from 'config/env/client';
import { FetchTokenResult } from '@wagmi/core';
import { PocketFaucetAbi } from 'pocket-contract/abi';
import { BigNumber } from 'ethers';
interface SmartContractProviderProps {
  children: React.ReactNode;
}

interface ISmartContractContext {
  erc20?: FetchTokenResult;
}

export function createCtx<A extends {} | null>() {
  const ctx = createContext<A | undefined>(undefined);
  return [ctx, ctx.Provider] as const;
}

const [SmartContractContext, SmartContractContextProvider] =
  createCtx<ISmartContractContext>();

export const SmartContractProvider = ({
  children,
}: SmartContractProviderProps) => {
  const { data: token } = useContractRead({
    address: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: PocketFaucetAbi,
    functionName: 'baseTokens',
    args: [BigNumber.from(0)],
  });

  const { data: erc20Data } = useToken({
    address: token,
    enabled: !!token,
  });

  const value = useMemo(() => {
    return {
      erc20: erc20Data,
    };
  }, [erc20Data]);

  return (
    <SmartContractContextProvider value={value}>
      {children}
    </SmartContractContextProvider>
  );
};

export function useSmartContract() {
  const c = useContext<ISmartContractContext | undefined>(SmartContractContext);
  if (c === undefined)
    throw new Error('useCtx must be inside a Provider with a value');
  return c;
}
