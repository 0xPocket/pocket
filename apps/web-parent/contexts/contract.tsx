import { createContext, useContext, useEffect, useState } from 'react';
import { providers } from 'ethers';
import {
  ERC20,
  ERC20__factory,
  IERC20Upgradeable,
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
  USDTContract: ERC20 | undefined;
  erc20Decimals: number | undefined;
  erc20Symbol: string | undefined;
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
  const [USDTContract, setUSDTContract] = useState<ERC20>();
  const [erc20Decimals, setErc20Decimals] = useState<number>();
  const [erc20Symbol, setErc20Symbol] = useState<string>();

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

      const usdtContract = ERC20__factory.connect(
        process.env.NEXT_PUBLIC_ERC20_FAKEUSDC_RINKEBY!,
        provider,
      );

      usdtContract.decimals().then((res) => {
        setErc20Decimals(res);
      });

      usdtContract.symbol().then((res) => {
        setErc20Symbol(res);
      });

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
        erc20Decimals,
        erc20Symbol,
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
