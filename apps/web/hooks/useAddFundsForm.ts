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

export function useAddFundsForm(
  childAddress: string,
  addChild: boolean,
  ceiling: string,
  periodicity: string,
  returnFn: () => void,
) {
  const { erc20 } = useSmartContract();
  const { address } = useAccount();
  const intl = useIntl();

  const { signPermit, isLoading: permitIsLoading } = usePermitTx({
    contractAddress: erc20.contract.address,
  });

  const { write, isLoading } = useSendMetaTx({
    contractAddress: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    contractInterface: PocketFaucetAbi,
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
              childAddress as `0x${string}`,
              {
                ceiling: parseUnits(ceiling, erc20.data?.decimals).toBigInt(),
                periodicity: BigNumber.from(periodicity).toBigInt(),
                tokenIndex: BigInt(0),
              },
              amount.toBigInt(),
              BigInt(deadline),
              signature.v,
              signature.r as `0x${string}`,
              signature.s as `0x${string}`,
            ]);
          } else {
            await write([
              childAddress as `0x${string}`,
              amount.toBigInt(),
              BigInt(deadline),
              signature.v,
              signature.r as `0x${string}`,
              signature.s as `0x${string}`,
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
