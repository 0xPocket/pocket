import { createContext, useContext, useEffect, useState } from 'react';
import { Contract } from 'ethers';
import { useWeb3Auth } from './web3hook';

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
  const [loading, setLoading] = useState<boolean>(false);
  const { address, provider } = useWeb3Auth();
  const [contract, setContract] = useState<Contract>();

  // console.log(abi);
  useEffect(() => {
    // const newContract = new Contract(
    //   '0x62a4b53a1de480be4bdb9c10d0f7de69aeb30abd',
    //   PocketFaucet.abi,
    // );
    // setContract(newContract);
    // console.log('new contract set');
  }, [provider]);

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
