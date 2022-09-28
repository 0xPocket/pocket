import { createContext, useContext, useMemo } from 'react';
import { useAccount, useContract, useToken } from 'wagmi';
import type {
  ERC20Permit,
  IERC20,
  PocketFaucet,
} from 'pocket-contract/typechain-types';
import { env } from 'config/env/client';
import { ERC20PermitAbi, PocketFaucetAbi } from 'pocket-contract/abi';

interface SmartContractProviderProps {
  children: React.ReactNode;
}

interface ISmartContractContext {
  erc20: {
    contract: IERC20;
    data:
      | {
          address: string;
          decimals: number;
          name: string;
          symbol: string;
        }
      | undefined;
  };
  pocketContract: PocketFaucet;
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

  const { data: erc20Data } = useToken({
    address: env.ERC20_ADDRESS,
    enabled: isConnected,
  });

  const erc20Contract = useContract<ERC20Permit>({
    addressOrName: env.ERC20_ADDRESS,
    contractInterface: ERC20PermitAbi,
  });

  const pocketContract = useContract<PocketFaucet>({
    addressOrName: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    contractInterface: PocketFaucetAbi,
  });

  const value = useMemo(() => {
    return {
      erc20: {
        data: erc20Data,
        contract: erc20Contract,
      },
      pocketContract,
    };
  }, [erc20Data, erc20Contract, pocketContract]);

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
