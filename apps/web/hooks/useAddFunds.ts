import { env } from 'config/env/client';
import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';
import { useSmartContract } from '../contexts/contract';
import { useIntl } from 'react-intl';
import { useSendMetaTx } from './useSendMetaTx';
import { usePermitTx } from './usePermitTx';
import { PocketFaucetAbi } from 'pocket-contract/abi';
import { Address } from 'abitype';

type UseAddFundsProps = {
  onSuccess?: () => void;
};

export function useAddFunds({ onSuccess }: UseAddFundsProps) {
  const { erc20 } = useSmartContract();
  const { address } = useAccount();
  const intl = useIntl();

  const { signPermit, isLoading: permitIsLoading } = usePermitTx({
    contractAddress: erc20?.address,
  });

  const { write, isLoading } = useSendMetaTx({
    address: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: PocketFaucetAbi,
    functionName: 'addFundsPermit',
    onMutate: () => {
      toast.dismiss();
      toast.info(intl.formatMessage({ id: 'transaction.pending' }), {
        isLoading: true,
      });
    },
    onSuccess: async () => {
      toast.dismiss();
      toast.success(intl.formatMessage({ id: 'add-child-and-funds.success' }));
      onSuccess?.();
    },
    onError() {
      toast.error(intl.formatMessage({ id: 'add-child-and-funds.error' }));
    },
  });

  const addFunds = useCallback(
    async (props: { childAddress: Address; amount: BigNumber }) => {
      try {
        if (!address) {
          return;
        }
        const res = await signPermit(address, props.amount.toString());

        if (res) {
          const { signature, deadline } = res;

          await write([
            props.childAddress,
            props.amount,
            BigNumber.from(deadline),
            signature.v,
            signature.r,
            signature.s,
          ]);
        }
      } catch (e) {}
    },
    [address, signPermit, write],
  );

  return {
    addFunds,
    isLoading: permitIsLoading || isLoading,
  };
}
