import type { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
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
    args: [address!, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!],
    enabled: !!address,
  });

  const approve = useApprove({
    erc20Address: erc20.contract.address,
    spender: pocketContract.address,
    amount:
      '0xf000000000000000000000000000000000000000000000000000000000000000',
    onError: (e) => {
      toast.error(
        `An error occured while doing your approve transaction: ${e.message}`,
      );
    },
    onSuccess: () => {
      toast.info(
        `The network is validating your approve. It may takes between 30 and 60 seconds, please wait`,
        {
          isLoading: true,
        },
      );
    },
  });

  const { config: addChildAndFundsConfig } = usePrepareContractWrite({
    addressOrName: pocketContract.address,
    contractInterface: pocketContract.interface,
    functionName: addChild ? 'addChildAndFunds' : 'addFunds',
    overrides: { gasLimit: '3000000' }, // TEMPORARY. necessary on testnet
    args: addChild
      ? ['5000000000000000000', '604800', childAddress, '0']
      : ['0', childAddress],
  });

  const addChildAndFunds = useContractWrite({
    ...addChildAndFundsConfig,
    onError: (e) => {
      toast.error(`An error occured while doing your deposit: ${e.message}`);
    },
    onSuccess: () => {
      toast.info(
        `The network is validating your approve. It may takes between 30 and 60 seconds, please wait`,
        {
          isLoading: true,
        },
      );
      returnFn();
    },
  });

  useWaitForTransaction({
    hash: approve.data?.hash,
    onSuccess: () => {
      toast.dismiss();
      toast.success(
        `Your transaction is validated, please validate the second one`,
      );
    },
  });

  useWaitForTransaction({
    hash: addChildAndFunds.data?.hash,
    onError: (e) => {
      toast.dismiss();
      toast.error(`An error occured while doing your deposit: ${e.message}`);
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success(
        `Your transaction is validated, the funds are now available`,
      );
    },
  });

  const approveAndAddChild = useCallback(
    async (amount: BigNumber) => {
      if (allowance?.lt(amount) && approve.write) {
        return approve.write();
      }

      if (addChildAndFunds.write) {
        return addChildAndFunds.write({
          recklesslySetUnpreparedArgs: addChild
            ? ['5000000000000000000', '604800', childAddress, amount]
            : [amount, childAddress],
        });
      } else return toast.error(`An error occured, please try again`);
    },
    [addChildAndFunds, approve, allowance, childAddress, addChild],
  );

  return { approveAndAddChild };
}
