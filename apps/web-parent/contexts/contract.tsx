import { createContext, useContext, useState } from 'react';
import PocketFaucetJson from 'pocket-contract/artifacts/contracts/PocketFaucet.sol/PocketFaucet.json';
import { erc20ABI, useContract, useSigner, useToken } from 'wagmi';
import { ERC20 } from 'pocket-contract/typechain-types';

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
  contract: ERC20 | undefined;
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
  const { data } = useToken({
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  });
  const [abi] = useState(PocketFaucetJson.abi);
  const { data: signer } = useSigner();

  const contract = useContract<ERC20>({
    addressOrName: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    contractInterface: erc20ABI,
    signerOrProvider: signer,
  });

  return (
    <SmartContractContextProvider
      value={{
        erc20Data: data,
        contract,
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
