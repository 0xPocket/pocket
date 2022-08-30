import type { TransactionResponse } from '@ethersproject/providers';
import type { CallOverrides, Contract } from 'ethers';
import { useDeprecatedContractWrite as wagmiUseContractWrite } from 'wagmi';
import type { UseContractWriteArgs } from 'wagmi/dist/declarations/src/hooks/contracts/useContractWrite';
import { usePrepareContractWrite as wagmiUsePrepareContractWrite } from 'wagmi';
import {
  UsePrepareContractWriteArgs,
  UsePrepareContractWriteConfig,
} from 'wagmi/dist/declarations/src/hooks/contracts/usePrepareContractWrite';

type UsePrepareContractWriteParams<
  T extends Contract,
  U extends ContractMethodNames<T>,
> = Omit<
  UsePrepareContractWriteArgs,
  'addressOrName' | 'contractInterface' | 'mode'
> &
  UsePrepareContractWriteConfig & {
    contract: T;
    functionName: U;
    args?: ContractMethodArgs<T, U>;
  };

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

export function usePrepareContractWrite<
  T extends Contract,
  U extends ContractMethodNames<T>,
>(params: UsePrepareContractWriteParams<T, U>) {
  const { contract, ...rest } = params;
  return wagmiUsePrepareContractWrite({
    addressOrName: contract.address,
    contractInterface: contract.interface,
    ...rest,
  });
}
