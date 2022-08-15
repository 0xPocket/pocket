import { createContext, useContext, useMemo } from 'react';
import PocketFaucetJson from 'pocket-contract/artifacts/contracts/PocketFaucet.sol/PocketFaucet.json';
import { erc20ABI, useAccount, useContract, useToken } from 'wagmi';
import type { IERC20, PocketFaucet } from 'pocket-contract/typechain-types';

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
    address: process.env.NEXT_PUBLIC_CHOSEN_ERC20,
    enabled: isConnected,
  });

  const erc20Contract = useContract<IERC20>({
    addressOrName: process.env.NEXT_PUBLIC_CHOSEN_ERC20!,
    contractInterface: erc20ABI,
  });

  const pocketContract = useContract<PocketFaucet>({
    addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    contractInterface: PocketFaucetJson.abi,
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
