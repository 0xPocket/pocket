import { createContext, useContext, useEffect, useState } from 'react';
import { providers, Wallet } from 'ethers';
import { ParentContract } from '@lib/contract';
import { useAuth } from '@lib/nest-auth/next';
import { UserParent } from '@lib/types/interfaces';

interface SmartContractProviderProps {
  children: React.ReactNode;
}

interface ISmartContractContext {
  active: boolean;
  provider: providers.JsonRpcProvider | undefined;
  parentContract: ParentContract | undefined;
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
  const [provider, setProvider] = useState<providers.JsonRpcProvider>();
  const [parentContract, setParentContract] = useState<ParentContract>();
  const { user } = useAuth<UserParent>();

  useEffect(() => {
    const provider = new providers.JsonRpcProvider('http://localhost:8545');
    setProvider(provider);
  }, []);

  // console.log(abi);
  useEffect(() => {
    if (!user || !user.wallet.privateKey) {
      console.error('SmartContractProvider: user infos missing');
      return;
    }

    if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
      console.error(
        "SmartContractProvider: cannot found smartcontract's address",
      );
      return;
    }

    const signer = new Wallet(user.wallet.privateKey, provider);

    const parentContract = new ParentContract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      signer,
    );
    setParentContract(parentContract);

    console.log('new contract set');
  }, [provider, user]);

  return (
    <SmartContractContextProvider
      value={{
        active: true,
        provider,
        parentContract,
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
