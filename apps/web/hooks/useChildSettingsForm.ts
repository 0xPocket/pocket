import { parseUnits } from 'ethers/lib/utils';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useSmartContract } from '../contexts/contract';
import { useIntl } from 'react-intl';
import { useSendMetaTx } from './useSendMetaTx';
import { env } from 'config/env/client';
import { PocketFaucetAbi } from 'pocket-contract/abi';
import { BigNumber } from 'ethers';
import { Address } from 'abitype';

type ChangeConfigProps = {
  ceiling: number;
  periodicity: string;
};

export function useChildSettingsForm(
  childAddress: Address | null,
  addChild: boolean,
  returnFn: () => void,
) {
  const { erc20 } = useSmartContract();
  const intl = useIntl();

  const { write, isLoading } = useSendMetaTx({
    address: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: PocketFaucetAbi,
    functionName: addChild ? 'addChild' : 'changeConfig',
    onMutate: () => {
      toast.info(
        intl.formatMessage({
          id: 'transaction.pending',
        }),
        {
          isLoading: true,
        },
      );
      returnFn();
    },
    onError() {
      toast.error(
        intl.formatMessage({ id: 'add-child-or-change-config.error' }),
      );
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success(
        intl.formatMessage({ id: 'add-child-or-change-config.success' }),
      );
    },
  });

  const changeConfig = useCallback(
    async (data: ChangeConfigProps) => {
      try {
        if (write && childAddress) {
          if (addChild) {
            await write([
              childAddress,
              {
                ceiling: parseUnits(data.ceiling.toString(), erc20?.decimals),
                periodicity: BigNumber.from(data.periodicity),
                tokenIndex: BigNumber.from(0),
              },
            ]);
          } else {
            await write([
              childAddress,
              parseUnits(data.ceiling.toString(), erc20?.decimals),
              BigNumber.from(data.periodicity),
            ]);
          }
        } else {
          return;
        }
      } catch (e) {}
    },
    [childAddress, write, erc20?.decimals, addChild],
  );

  return { changeConfig, isLoading: isLoading };
}
