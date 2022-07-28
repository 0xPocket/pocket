import type { TransactionResponse } from '@ethersproject/providers';
import type { CallOverrides, Contract } from 'ethers';
import { useDeprecatedContractWrite as wagmiUseContractWrite } from 'wagmi';
import type { UseContractWriteArgs } from 'wagmi/dist/declarations/src/hooks/contracts/useContractWrite';

type ContractMethodNames<T extends Contract> = keyof T['functions'];

type ContractMethodArgs<
  T extends Contract,
  U extends ContractMethodNames<T>,
> = T['functions'][U] extends (...args: infer P) => unknown ? P : never;

type UseContractWriteParams<
  T extends Contract,
  U extends ContractMethodNames<T>,
> = Omit<
  UseContractWriteArgs,
  'addressOrName' | 'contractInterface' | 'mode'
> & {
  contract: T;
  functionName: U;
  args?: ContractMethodArgs<T, U>;
};

type UseContractWriteMutationArgs<
  T extends Contract,
  U extends ContractMethodNames<T>,
> = {
  args: ContractMethodArgs<T, U>;
  overrides?: CallOverrides;
};

export type UseContractWriteReturn<
  T extends Contract,
  U extends ContractMethodNames<T>,
> = ReturnType<typeof wagmiUseContractWrite> & {
  write: (
    overrideConfig?: UseContractWriteMutationArgs<T, U> | undefined,
  ) => void;
  writeAsync: (
    overrideConfig?: UseContractWriteMutationArgs<T, U> | undefined,
  ) => Promise<TransactionResponse>;
};

export default function useContractWrite<
  T extends Contract,
  U extends ContractMethodNames<T>,
>(params: UseContractWriteParams<T, U>): UseContractWriteReturn<T, U> {
  const { contract, ...rest } = params;
  return wagmiUseContractWrite({
    addressOrName: contract.address,
    contractInterface: contract.interface,
    ...rest,
  }) as UseContractWriteReturn<T, U>;
}
