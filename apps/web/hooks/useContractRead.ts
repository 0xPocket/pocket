import type { ReadContractConfig } from '@wagmi/core';
import type { Contract } from 'ethers';
import { useContractRead as wagmiUseContractRead } from 'wagmi';
import type { UseContractReadConfig } from 'wagmi/dist/declarations/src/hooks/contracts/useContractRead';

// Wagmi doesn't export this type
type UseContractReadArgs = ReadContractConfig & {
  /** If set to `true`, the cache will depend on the block number */
  cacheOnBlock?: boolean;
  /** Subscribe to changes */
  watch?: boolean;
};

type ContractMethodNames<T extends Contract> = keyof T['functions'];

type ContractMethodArgs<
  T extends Contract,
  U extends ContractMethodNames<T>,
> = T['functions'][U] extends (...args: infer P) => unknown ? P : never;

export type ContractMethodReturn<
  T extends Contract,
  K extends ContractMethodNames<T>,
> = Awaited<ReturnType<T['functions'][K]>>;

export type UseContractReadParams<
  T extends Contract,
  U extends ContractMethodNames<T>,
> = Omit<UseContractReadArgs, 'addressOrName' | 'contractInterface' | 'args'> &
  UseContractReadConfig & {
    contract: T;
    functionName: U;
    args?: ContractMethodArgs<T, U>;
  };

export type UseContractReadReturn<
  T extends Contract,
  U extends ContractMethodNames<T>,
> = ReturnType<typeof wagmiUseContractRead> & {
  data?: ContractMethodReturn<T, U>;
};

export default function useContractRead<
  T extends Contract,
  U extends ContractMethodNames<T>,
>(params: UseContractReadParams<T, U>): UseContractReadReturn<T, U> {
  const { contract, ...rest } = params;
  return wagmiUseContractRead({
    addressOrName: contract.address,
    contractInterface: contract.interface,
    ...rest,
  }) as UseContractReadReturn<T, U>;
}
