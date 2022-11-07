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
import { generateMetaTransaction } from '../utils/generateMetaTx';
import { type providers } from 'ethers';
import { trpc } from '../utils/trpc';
import { env } from 'config/env/client';
import type { TRPCError } from '@trpc/server';
import { ForwarderAbi } from 'pocket-contract/abi';
import { toast } from 'react-toastify';

type UseSendMetaTx<
  TAbi extends Abi,
  TMethod extends ExtractAbiFunctionNames<TAbi>,
> = {
  abi: TAbi;
  address: string;
  functionName: TMethod;
  onSuccess?: (data: providers.TransactionReceipt) => void;
  onError?: (err: Error | TRPCError) => void;
  onMutate?: () => void;
};

export function useSendMetaTx<
  TAbi extends Abi,
  TMethod extends ExtractAbiFunctionNames<TAbi>,
  TArgs extends ExtractAbiFunctionParams<TAbi, TMethod>,
>({
  abi,
  address,
  functionName,
  onSuccess,
  onError,
  onMutate,
}: UseSendMetaTx<TAbi, TMethod>) {
  const { address: accountAddress } = useAccount();
  const providerWagmi = useProvider();
  const [loading, setLoading] = useState(false);
  const sendMetaTx = trpc.useMutation(['relayer.forward'], {
    onMutate: () => {
      toast.info('Transaction sent, please wait a few seconds...');
    },
    onSuccess: () => {
      onMutate?.();
    },
    onError: (err) => {
      setLoading(false);
      onError?.(err as any);
    },
  });

  const { signTypedDataAsync } = useSignTypedData();

  const { isLoading, isError, isSuccess, status } = useWaitForTransaction({
    hash: sendMetaTx.data?.txHash as `0x${string}`,
    enabled: !!sendMetaTx.data?.txHash,
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
      if (!accountAddress) {
        return;
      }

      try {
        setLoading(true);

        const toSign = await generateMetaTransaction({
          forwarderAddress: env.TRUSTED_FORWARDER,
          forwarderInterface: ForwarderAbi,
          contractAddress: address,
          contractInterface: abi,
          provider: providerWagmi,
          domain: {
            name: 'Pocket',
            version: '0.0.1',
          },
          chainId: env.CHAIN_ID,
          from: accountAddress,
          functionName,
          args,
        });

        const signature = await signTypedDataAsync(toSign);

        return sendMetaTx.mutateAsync({
          signature: signature,
          request: toSign.value,
          functionName,
        });
      } catch (e) {
        const err = e as ProviderRpcError;
        setLoading(false);
        console.error('Error:', err.message);
      }
    },
    [
      address,
      functionName,
      signTypedDataAsync,
      providerWagmi,
      sendMetaTx,
      abi,
      accountAddress,
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
