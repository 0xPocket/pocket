import { env } from 'config/env/client';
import type { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import { useSmartContract } from '../contexts/contract';
import { useApprove } from './useApprove';
import useContractRead from './useContractRead';
import { useIntl } from 'react-intl';
import { UserChild } from '@lib/types/interfaces';
import { parseUnits } from 'ethers/lib/utils';

export function useAddFundsForm(
  child: UserChild | null,
  addChild: boolean,
  returnFn: () => void,
) {
  const { pocketContract, erc20 } = useSmartContract();
  const { address } = useAccount();
  const intl = useIntl();

  const { data: allowance, refetch: refetchAllowance } = useContractRead({
    contract: erc20.contract,
    functionName: 'allowance',
    args: [address!, env.NEXT_PUBLIC_CONTRACT_ADDRESS],
    enabled: !!address,
  });

  const approve = useApprove({
    erc20Address: erc20.contract.address,
    spender: pocketContract.address,
    amount:
      '0xf000000000000000000000000000000000000000000000000000000000000000',
    onSuccess: () => {
      toast.info(intl.formatMessage({ id: 'transaction.next' }), {
        isLoading: true,
      });
    },
    onError: () => {
      toast.error(
        intl.formatMessage({ id: 'add-child-and-funds.approve-fail' }),
      );
    },
  });

  const addChildAndFunds = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: pocketContract.address,
    contractInterface: pocketContract.interface,
    functionName: addChild ? 'addChildAndFunds' : 'addFunds',
    // ! TEMPORARY. necessary on testnet
    overrides: { gasLimit: '3000000' },
    onSuccess: () => {
      toast.dismiss();
      toast.info(intl.formatMessage({ id: 'transaction.pending' }), {
        isLoading: true,
      });
      returnFn();
    },
    onError: (e) => {
      toast.error(
        intl.formatMessage(
          { id: 'add-child-and-funds.error' },
          { message: e.message },
        ),
      );
    },
  });

  useWaitForTransaction({
    hash: approve.data?.hash,
    onError: (e) => {
      toast.error(
        intl.formatMessage(
          { id: 'add-child-and-funds.approve' },
          { message: e.message },
        ),
      );
    },
    onSuccess: () => {
      toast.success(
        intl.formatMessage({ id: 'add-child-and-funds.approve-success' }),
      );
      refetchAllowance();
    },
  });

  useWaitForTransaction({
    hash: addChildAndFunds.data?.hash,
    onError: (e) => {
      toast.dismiss();
      toast.error(
        intl.formatMessage(
          { id: 'add-child-and-funds.error' },
          { message: e.message },
        ),
      );
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success(intl.formatMessage({ id: 'add-child-and-funds.success' }));
    },
  });

  const approveAndAddChild = useCallback(
    async (amount: BigNumber) => {
      try {
        if (allowance?.lt(amount) && approve.writeAsync) {
          await approve.writeAsync();
        }

        if (addChildAndFunds.writeAsync && child?.child?.initialCeiling) {
          await addChildAndFunds.writeAsync({
            recklesslySetUnpreparedArgs: addChild
              ? [
                  parseUnits(
                    child.child.initialCeiling.toString(),
                    erc20.data?.decimals,
                  ),
                  child.child.initialPeriodicity,
                  child.address,
                  amount,
                ]
              : [child?.address, amount],
          });
        }
      } catch (e) {}
    },
    [
      addChildAndFunds,
      approve,
      allowance,
      child?.address,
      addChild,
      child?.child,
      erc20.data?.decimals,
    ],
  );

  return {
    approveAndAddChild,
    isLoading: approve.isLoading || addChildAndFunds.isLoading,
  };
}
