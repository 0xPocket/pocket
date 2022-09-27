import {
  ProviderRpcError,
  useAccount,
  useProvider,
  useSignTypedData,
  useWaitForTransaction,
} from 'wagmi';
import { useCallback, useState } from 'react';
import type { Abi, ExtractAbiFunctionNames } from 'abitype';
import type { ExtractAbiFunctionParams } from '../utils/abi-types';
import { CustomForwarderAbi } from 'pocket-contract/abi';
import { generateMetaTransaction } from '../utils/generateMetaTx';
import { type providers } from 'ethers';
import { trpc } from '../utils/trpc';
import { env } from 'config/env/client';

type UseSendMetaTx<
  TAbi extends Abi,
  TMethod extends ExtractAbiFunctionNames<TAbi>,
> = {
  contractInterface: TAbi;
  contractAddress: string;
  functionName: TMethod;
  onSuccess?: (data: providers.TransactionReceipt) => void;
  onError?: (err: Error) => void;
  onMutate?: () => void;
};

export function useSendMetaTx<
  TAbi extends Abi,
  TMethod extends ExtractAbiFunctionNames<TAbi>,
  TArgs extends ExtractAbiFunctionParams<TAbi, TMethod>,
>({
  contractInterface,
  contractAddress,
  functionName,
  onSuccess,
  onError,
  onMutate,
}: UseSendMetaTx<TAbi, TMethod>) {
  const { address } = useAccount();
  const providerWagmi = useProvider();
  const [loading, setLoading] = useState(false);
  const sendMetaTx = trpc.useMutation(['relayer.relay'], {
    onSuccess: () => {
      onMutate?.();
    },
  });

  const { signTypedDataAsync } = useSignTypedData();

  const { isLoading, isError, isSuccess, status } = useWaitForTransaction({
    hash: sendMetaTx.data?.txHash,
    onSuccess: (data) => {
      setLoading(false);
      onSuccess?.(data);
    },
    onError: (error) => {
      setLoading(false);
      onError?.(error);
    },
  });

  const sendTransaction = useCallback(
    async (args: TArgs) => {
      if (!address) {
        return;
      }

      try {
        setLoading(true);

        const toSign = await generateMetaTransaction({
          forwarderAddress: env.TRUSTED_FORWARDER,
          forwarderInterface: CustomForwarderAbi,
          contractAddress: contractAddress,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          contractInterface: contractInterface as any,
          provider: providerWagmi,
          domain: {
            name: 'Pocket',
            version: '0.0.1',
          },
          chainId: 137,
          from: address,
          functionName,
          args,
        });

        console.log('toSign', toSign);

        const signature = await signTypedDataAsync(toSign);

        await sendMetaTx.mutateAsync({
          signature: signature,
          request: toSign.value,
        });

        return;
      } catch (e) {
        const err = e as ProviderRpcError;
        setLoading(false);
        console.error('Error:', err.message);
      }
    },
    [
      address,
      contractAddress,
      contractInterface,
      functionName,
      signTypedDataAsync,
      providerWagmi,
      sendMetaTx,
    ],
  );

  return {
    write: sendTransaction,
    status: loading ? 'loading' : status,
    isLoading: loading || isLoading,
    isError,
    isSuccess,
  };
}
