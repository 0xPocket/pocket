import { parseUnits } from 'ethers/lib/utils';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useSmartContract } from '../contexts/contract';
import { useIntl } from 'react-intl';
import { useSendMetaTx } from './useSendMetaTx';
import { env } from 'config/env/client';
import { PocketFaucetAbi } from 'pocket-contract/abi';

type ChangeConfigProps = {
  ceiling: number;
  periodicity: string;
};

export function useChildSettingsForm(
  childAddress: string | null,
  addChild: boolean,
  returnFn: () => void,
) {
  const { erc20 } = useSmartContract();
  const intl = useIntl();

  const { write, isLoading } = useSendMetaTx({
    contractAddress: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    contractInterface: PocketFaucetAbi,
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
          await write([
            parseUnits(
              data.ceiling.toString(),
              erc20.data?.decimals,
            ).toBigInt(),
            BigInt(data.periodicity),
            childAddress as `0x${string}`,
          ]);
        } else {
          return;
        }
      } catch (e) {}
    },
    [childAddress, write, erc20.data?.decimals],
  );

  return { changeConfig, isLoading: isLoading };
}
