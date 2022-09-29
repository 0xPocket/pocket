import { env } from 'config/env/client';
import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';
import { useSmartContract } from '../contexts/contract';
import { useIntl } from 'react-intl';
import { UserChild } from '@lib/types/interfaces';
import { parseUnits } from 'ethers/lib/utils';
import { useSendMetaTx } from './useSendMetaTx';
import { usePermitTx } from './usePermitTx';
import { PocketFaucetAbi } from 'pocket-contract/abi';

export function useAddFundsForm(
  child: UserChild | null,
  addChild: boolean,
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

        if (res && child?.child?.initialCeiling) {
          const { signature, deadline } = res;

          if (addChild) {
            await write([
              parseUnits(
                child.child.initialCeiling.toString(),
                erc20.data?.decimals,
              ).toBigInt(),
              BigNumber.from(child.child.initialPeriodicity).toBigInt(),
              child.address as `0x${string}`,
              amount.toBigInt(),
              BigInt(deadline),
              signature.v,
              signature.r as `0x${string}`,
              signature.s as `0x${string}`,
            ]);
          } else {
            await write([
              child.address as `0x${string}`,
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
      child?.address,
      address,
      signPermit,
      addChild,
      child?.child,
      erc20.data?.decimals,
      write,
    ],
  );

  return {
    approveAndAddChild,
    isLoading: permitIsLoading || isLoading,
  };
}
