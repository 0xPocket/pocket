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

export function useAddFundsForm(
  childAddress: Address,
  addChild: boolean,
  ceiling: string,
  periodicity: string,
  returnFn: () => void,
) {
  const { erc20 } = useSmartContract();
  const { address } = useAccount();
  const intl = useIntl();

  const { signPermit, isLoading: permitIsLoading } = usePermitTx({
    contractAddress: erc20?.address,
  });

  const { write, isLoading } = useSendMetaTx({
    address: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: PocketFaucetAbi,
    functionName: addChild ? 'addChildAndFundsPermit' : 'addFundsPermit',
    onMutate: () => {
      toast.dismiss();
      toast.info(intl.formatMessage({ id: 'transaction.pending' }), {
        isLoading: true,
      });
      returnFn();
    },
    onSuccess: async () => {
      toast.dismiss();
      toast.success(intl.formatMessage({ id: 'add-child-and-funds.success' }));
    },
    onError() {
      toast.error(intl.formatMessage({ id: 'add-child-and-funds.error' }));
    },
  });

  const approveAndAddChild = useCallback(
    async (amount: BigNumber) => {
      try {
        const res = await signPermit(address!, amount.toString());

        if (res && childAddress) {
          const { signature, deadline } = res;

          if (addChild) {
            await write([
              childAddress,
              {
                ceiling: parseUnits(ceiling, erc20?.decimals),
                periodicity: BigNumber.from(periodicity),
                tokenIndex: BigNumber.from(0),
              },
              amount,
              BigNumber.from(deadline),
              signature.v,
              signature.r,
              signature.s,
            ]);
          } else {
            await write([
              childAddress,
              amount,
              BigNumber.from(deadline),
              signature.v,
              signature.r,
              signature.s,
            ]);
          }
        }
      } catch (e) {}
    },
    [
      childAddress,
      ceiling,
      periodicity,
      address,
      signPermit,
      addChild,
      write,
      erc20,
    ],
  );

  return {
    approveAndAddChild,
    isLoading: permitIsLoading || isLoading,
  };
}
