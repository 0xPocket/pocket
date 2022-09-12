import { env } from 'config/env/client';
import type { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import { useSmartContract } from '../contexts/contract';
import { useApprove } from './useApprove';
import useContractRead from './useContractRead';

export function useAddFundsForm(
  childAddress: string | null,
  addChild: boolean,
  returnFn: () => void,
) {
  const { pocketContract, erc20 } = useSmartContract();
  const { address } = useAccount();

  const { data: allowance } = useContractRead({
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
    onError: (e) => {
      toast.error(
        `Approval failed : ${e.message}. If the problem persits, contact us.`,
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
    onError: (e) => {
      toast.error(
        `Deposit failed : ${e.message}. If the problem persits, contact us.`,
      );
    },
    onSuccess: () => {
      toast.info(`Transaction pending, please hang on !`, {
        isLoading: true,
      });
      returnFn();
    },
  });

  useWaitForTransaction({
    hash: addChildAndFunds.data?.hash,
    onError: (e) => {
      toast.dismiss();
      toast.error(
        `Deposit failed: ${e.message}. If the problem persits, contact us.`,
      );
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success(`Successfull deposit !`);
    },
  });

  const approveAndAddChild = useCallback(
    async (amount: BigNumber) => {
      try {
        if (allowance?.lt(amount) && approve.writeAsync) {
          await approve.writeAsync();
        }

        if (addChildAndFunds.writeAsync) {
          await addChildAndFunds.writeAsync({
            recklesslySetUnpreparedArgs: addChild
              ? ['5000000000000000000', '604800', childAddress, amount]
              : [amount, childAddress],
          });
        }
      } catch (e) {}
    },
    [addChildAndFunds, approve, allowance, childAddress, addChild],
  );

  return { approveAndAddChild };
}
