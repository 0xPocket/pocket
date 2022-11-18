import { env } from 'config/env/client';
import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';
import { useSmartContract } from '../contexts/contract';
import { useIntl } from 'react-intl';
import { parseUnits } from 'ethers/lib/utils';
import { useSendMetaTx } from './useSendMetaTx';
import { usePermitTx } from './usePermitTx';
import { PocketFaucetAbi } from 'pocket-contract/abi';
import { Address } from 'abitype';

export function useAddChildAndFunds() {
  const { erc20 } = useSmartContract();
  const { address } = useAccount();
  const intl = useIntl();

  const { signPermit, isLoading: permitIsLoading } = usePermitTx({
    contractAddress: erc20?.address,
  });

  const { write, isLoading } = useSendMetaTx({
    address: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: PocketFaucetAbi,
    functionName: 'addChildAndFundsPermit',
    onMutate: () => {
      toast.dismiss();
      toast.info(intl.formatMessage({ id: 'transaction.pending' }), {
        isLoading: true,
      });
    },
    onSuccess: async () => {
      toast.dismiss();
      toast.success(intl.formatMessage({ id: 'add-child-and-funds.success' }));
    },
    onError() {
      toast.error(intl.formatMessage({ id: 'add-child-and-funds.error' }));
    },
  });

  const addChildAndFunds = useCallback(
    async (props: {
      childAddress: Address;
      ceiling: BigNumber;
      periodicity: BigNumber;
      amount: BigNumber;
    }) => {
      try {
        if (!address) {
          return;
        }
        const res = await signPermit(address, props.amount.toString());

        if (res) {
          const { signature, deadline } = res;
          await write([
            props.childAddress,
            {
              ceiling: parseUnits(props.ceiling.toString(), erc20?.decimals),
              periodicity: BigNumber.from(props.periodicity),
              tokenIndex: BigNumber.from(0),
            },
            parseUnits(props.amount.toString(), erc20?.decimals),
            BigNumber.from(deadline),
            signature.v,
            signature.r,
            signature.s,
          ]);
        }
      } catch (e) {}
    },
    [address, signPermit, write, erc20],
  );

  return {
    addChildAndFunds,
    isLoading: permitIsLoading || isLoading,
  };
}
