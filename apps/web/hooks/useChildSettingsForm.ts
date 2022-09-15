import { parseUnits } from 'ethers/lib/utils';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { useSmartContract } from '../contexts/contract';
import { useIntl } from 'react-intl';

type ChangeConfigProps = {
  ceiling: number;
  periodicity: string;
};

export function useChildSettingsForm(
  childAddress: string | null,
  addChild: boolean,
  returnFn: () => void,
) {
  const { pocketContract, erc20 } = useSmartContract();
  const intl = useIntl();

  const addChildOrChangeConfig = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: pocketContract.address,
    contractInterface: pocketContract.interface,
    functionName: addChild ? 'addChild' : 'changeConfig',
    // ! TEMPORARY. necessary on testnet
    overrides: { gasLimit: '3000000' },
    onError(e) {
      console.log(e.message);
      toast.error(
        intl.formatMessage({ id: 'add-child-or-change-config.fail' }),
      );
      // toast.error(`An error occured while setting your child configuration`);
    },
    onSuccess: () => {
      toast.info(`Transaction pending, please hang on !`, {
        isLoading: true,
      });
      returnFn();
    },
  });

  useWaitForTransaction({
    hash: addChildOrChangeConfig.data?.hash,
    onError: (e) => {
      toast.dismiss();
      toast.error(
        intl.formatMessage(
          { id: 'add-child-or-change-config.error' },
          { message: e.message },
        ),
        // `Changing config failed: ${e.message}. If the problem persists, contact us.`,
      );
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success(
        intl.formatMessage({ id: 'add-child-or-change-config.success' }),
        // `Configuration sets successfully !`
      );
    },
  });

  const changeConfig = useCallback(
    async (data: ChangeConfigProps) => {
      try {
        if (addChildOrChangeConfig.writeAsync) {
          await addChildOrChangeConfig.writeAsync({
            recklesslySetUnpreparedArgs: [
              parseUnits(data.ceiling.toString(), erc20.data?.decimals),
              data.periodicity,
              childAddress,
            ],
          });
        }
      } catch (e) {}
    },
    [childAddress, addChildOrChangeConfig, erc20.data?.decimals],
  );

  return { changeConfig, isLoading: addChildOrChangeConfig.isLoading };
}
