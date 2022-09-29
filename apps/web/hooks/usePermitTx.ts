import {
  ProviderRpcError,
  useAccount,
  useProvider,
  useSignTypedData,
} from 'wagmi';
import { useCallback, useState } from 'react';
import { ethers } from 'ethers';
import { env } from 'config/env/client';
import { generatePermitTx } from '../utils/generatePermitTx';
import { useSmartContract } from '../contexts/contract';

type UsePermitTx = {
  contractAddress: string;
};

export function usePermitTx({ contractAddress }: UsePermitTx) {
  const { address } = useAccount();
  const providerWagmi = useProvider();
  const [loading, setLoading] = useState(false);
  const { erc20 } = useSmartContract();

  const { signTypedDataAsync } = useSignTypedData({
    onError: () => {
      setLoading(false);
    },
  });

  const signPermit = useCallback(
    async (owner: string, value: string) => {
      if (!address || !erc20.data) {
        return;
      }

      try {
        setLoading(true);

        const toSign = await generatePermitTx({
          erc20Address: contractAddress,
          owner: owner,
          spender: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          value: value,
          provider: providerWagmi,
          domain: {
            name: erc20.data.name,
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
    [address, contractAddress, erc20.data, signTypedDataAsync, providerWagmi],
  );

  return {
    signPermit,
    status: loading ? 'loading' : status,
    isLoading: loading,
  };
}
