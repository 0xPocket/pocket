import type {
  Abi,
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from 'abitype';
import { GetReturnType } from '@wagmi/core/internal';

export type ExtractAbiFunctionParams<
  TAbi extends Abi,
  TMethod extends ExtractAbiFunctionNames<TAbi>,
> = AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TMethod>['inputs']>;

export type ExtractAbiReturnType<
  TAbi extends Abi,
  TMethod extends ExtractAbiFunctionNames<TAbi>,
> = GetReturnType<{ abi: TAbi; functionName: TMethod }>;
