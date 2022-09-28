import {
  ProviderRpcError,
  useAccount,
  useProvider,
  useSignTypedData,
} from 'wagmi';
import { useCallback, useState } from 'react';
import type { Abi } from 'abitype';
import { ethers } from 'ethers';
import { env } from 'config/env/client';
import { generatePermitTx } from '../utils/generatePermitTx';

type UsePermitTx<TAbi extends Abi> = {
  contractInterface: TAbi;
  contractAddress: string;
};

export function usePermitTx<TAbi extends Abi>({
  contractInterface,
  contractAddress,
}: UsePermitTx<TAbi>) {
  const { address } = useAccount();
  const providerWagmi = useProvider();
  const [loading, setLoading] = useState(false);

  const { signTypedDataAsync } = useSignTypedData();

  const signPermit = useCallback(
    async (owner: string, value: string) => {
      if (!address) {
        return;
      }

      try {
        setLoading(true);

        const toSign = await generatePermitTx({
          erc20Address: contractAddress,
          erc20Interface: contractInterface,
          functionName: 'permit',
          owner: owner,
          spender: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          value: value,
          provider: providerWagmi,
          domain: {
            name: 'USD Coin (PoS)',
            version: '1',
          },
        });

        const signature = await signTypedDataAsync(toSign);

        setLoading(false);
        return {
          signature: ethers.utils.splitSignature(signature),
          deadline: toSign.value.deadline,
        };
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
      signTypedDataAsync,
      providerWagmi,
    ],
  );

  return {
    signPermit,
    status: loading ? 'loading' : status,
    isLoading: loading,
  };
}
