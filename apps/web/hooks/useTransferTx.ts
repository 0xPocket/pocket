import {
  ProviderRpcError,
  useAccount,
  useProvider,
  useSignTypedData,
} from 'wagmi';
import { useCallback, useState } from 'react';
import { ethers } from 'ethers';
import { useSmartContract } from '../contexts/contract';
import { generateTransferTx } from '../utils/generateTransferTx';
import { Address } from 'abitype';

type UseTransferTx = {
  contractAddress?: string;
};

export function useTransferTx({ contractAddress }: UseTransferTx) {
  const { address } = useAccount();
  const providerWagmi = useProvider();
  const [loading, setLoading] = useState(false);
  const { erc20 } = useSmartContract();

  const { signTypedDataAsync } = useSignTypedData({
    onError: () => {
      setLoading(false);
    },
  });

  const signTransfer = useCallback(
    async (from: Address, to: Address, value: string) => {
      if (!address || !erc20 || !contractAddress) {
        return;
      }

      try {
        setLoading(true);

        const toSign = await generateTransferTx({
          erc20Address: contractAddress,
          from,
          to,
          value: value,
          provider: providerWagmi,
          domain: {
            name: erc20.name,
            version: '1',
          },
        });

        const signature = await signTypedDataAsync(toSign);

        setLoading(false);

        return {
          signature: ethers.utils.splitSignature(signature),
          validAfter: toSign.value.validAfter,
          validBefore: toSign.value.validBefore,
          nonce: toSign.value.nonce,
        };
      } catch (e) {
        const err = e as ProviderRpcError;
        setLoading(false);
        console.error('Error:', err.message);
      }
    },
    [address, contractAddress, erc20, signTypedDataAsync, providerWagmi],
  );

  return {
    signTransfer,
    isLoading: loading,
  };
}
