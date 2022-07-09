import { createContext, useContext, useEffect } from 'react';
import { useAccount, useContract, useContractRead } from 'wagmi';
import PocketFaucet from 'pocket-contract/artifacts/contracts/PocketFaucet.sol/PocketFaucet.json';

interface SmartContractProviderProps {
  children: React.ReactNode;
}

interface ISmartContractContext {
  active: boolean;
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
  // const contract = useContract({
  //   addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
  //   contractInterface: ensRegistryABI,
  // })
  // const { address } = useAccount();

  // const {
  //   data: childConfig,
  //   isError,
  //   isLoading,
  //   refetch,
  // } = useContractRead({
  //   addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
  //   contractInterface: PocketFaucet.abi,
  //   functionName: 'childToConfig',
  //   args: address,
  // });

  // childConfig?.length && console.log(childConfig.length);

  return (
    <SmartContractContextProvider
      value={{
        active: true,
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
