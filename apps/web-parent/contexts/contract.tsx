import { createContext, useContext, useState } from 'react';
import PocketFaucetJson from 'pocket-contract/artifacts/contracts/PocketFaucet.sol/PocketFaucet.json';
import { useAccount, useToken } from 'wagmi';

interface SmartContractProviderProps {
  children: React.ReactNode;
}

interface ISmartContractContext {
  erc20Data:
    | {
        address: string;
        decimals: number;
        name: string;
        symbol: string;
      }
    | undefined;
  abi: typeof PocketFaucetJson.abi;
}

export function createCtx<A extends {} | null>() {
  const ctx = createContext<A | undefined>(undefined);
  return [ctx, ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
}

const [SmartContractContext, SmartContractContextProvider] =
  createCtx<ISmartContractContext>();

export const SmartContractProvider = ({
  children,
}: SmartContractProviderProps) => {
  const { isConnected } = useAccount();

  const { data } = useToken({
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    enabled: isConnected,
  });

  const [abi] = useState(PocketFaucetJson.abi);

  return (
    <SmartContractContextProvider
      value={{
        erc20Data: data,
        abi,
      }}
    >
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
