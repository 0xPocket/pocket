import { createContext, useContext, useEffect, useState } from 'react';
import { providers } from 'ethers';
import {
  IERC20Upgradeable,
  IERC20Upgradeable__factory,
  PocketFaucet,
  PocketFaucet__factory,
} from 'pocket-contract/typechain-types';

interface SmartContractProviderProps {
  children: React.ReactNode;
}

interface ISmartContractContext {
  active: boolean;
  provider: providers.JsonRpcProvider | undefined;
  contract: PocketFaucet | undefined;
  USDTContract: IERC20Upgradeable | undefined;
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
  const [contract, setContract] = useState<PocketFaucet>();
  const [USDTContract, setUSDTContract] = useState<IERC20Upgradeable>();

  useEffect(() => {
    const provider = new providers.JsonRpcProvider('http://localhost:8545');
    setProvider(provider);
  }, []);

  useEffect(() => {
    if (provider) {
      const contract = PocketFaucet__factory.connect(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        provider,
      );

      setContract(contract);

      const usdtContract = IERC20Upgradeable__factory.connect(
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        provider,
      );

      setUSDTContract(usdtContract);
    }
  }, [provider]);

  return (
    <SmartContractContextProvider
      value={{
        active: true,
        provider,
        contract,
        USDTContract,
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
