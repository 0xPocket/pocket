import { faAngleLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { UserChild } from '@lib/types/interfaces';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { useSmartContract } from '../../../contexts/contract';
import { erc20ABI, useAccount, useContractRead } from 'wagmi';
import type { BigNumber } from 'ethers';
import { z } from 'zod';
import { useZodForm } from '../../../utils/useZodForm';
import { Dispatch, SetStateAction, useEffect } from 'react';
import FormattedMessage from '../../common/FormattedMessage';
import { useIntl } from 'react-intl';
import { Spinner } from '../../common/Spinner';
import SetChildConfigForm from './SetChildConfigForm';
import { PocketFaucetAbi } from 'pocket-contract/abi';
import { ExtractAbiReturnType } from '../../../utils/abi-types';

type AddFundsFormProps = {
  child: UserChild;
  addFunds: (amount: BigNumber) => Promise<void>;
  isLoading: boolean;
  config: ExtractAbiReturnType<typeof PocketFaucetAbi, 'childToConfig'>;
  periodicity: string;
  setCeiling: Dispatch<SetStateAction<string>>;
  setPeriodicity: Dispatch<SetStateAction<string>>;
  returnFn: () => void;
};

function AddFundsForm({
  child,
  addFunds,
  returnFn,
  isLoading,
  config,
  periodicity,
  setCeiling,
  setPeriodicity,
}: AddFundsFormProps) {
  const { erc20 } = useSmartContract();
  const { address } = useAccount();
  const intl = useIntl();

  const { data: balance } = useContractRead({
    address: erc20?.address,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [address!],
    enabled: !!address && !!erc20,
  });

  const ChildSettingsSchema = z.object({
    topup: z
      .number({
        invalid_type_error: intl.formatMessage({
          id: 'funds-form.amount-required',
        }),
      })
      .min(
        1,
        intl.formatMessage({
          id: 'funds-form.minimum',
        }),
      )
      .max(
        Number(formatUnits(balance || 0, erc20?.decimals)),
        intl.formatMessage({
          id: 'funds-form.insufficient',
        }),
      ),
  });

  type FormValues = z.infer<typeof ChildSettingsSchema>;

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { isValid },
    setValue,
  } = useZodForm({
    reValidateMode: 'onChange',
    mode: 'all',
    schema: ChildSettingsSchema,
  });

  const onSubmit = async (data: FormValues) => {
    addFunds(parseUnits(data.topup.toString(), erc20?.decimals));
  };

  useEffect(() => {
    setFocus('topup');
  }, [setFocus]);

  if (config.periodicity.isZero() && periodicity == '0') {
    return (
      <SetChildConfigForm
        setCeiling={setCeiling}
        setPeriodicity={setPeriodicity}
        returnFn={returnFn}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full flex-col items-end justify-between space-y-4"
    >
      <div className="flex flex-col items-end gap-2">
        <label htmlFor="topup">
          <FormattedMessage
            id="funds-form.add-funds-to"
            values={{
              name: child.name,
            }}
          />
        </label>

        <div className="relative flex items-center text-4xl">
          <input
            className="input-number"
            placeholder="0"
            type="number"
            min="0"
            step={1 / 10 ** erc20?.decimals!}
            onKeyDown={(e) => {
              if (e.key === 'e' || e.key === '-') {
                e.preventDefault();
              }
            }}
            {...register('topup', {
              valueAsNumber: true,
            })}
          />
          <span>$</span>
        </div>
        <div className="flex gap-2">
          {balance && (
            <span className="text-gray">
              Balance:{' '}
              {Number(formatUnits(balance.toString(), erc20?.decimals)).toFixed(
                2,
              )}
            </span>
          )}
          <button
            className="rounded bg-primary px-2"
            onClick={(e) => {
              e.preventDefault();
              if (!balance?.isZero()) {
                setValue(
                  'topup',
                  Number(formatUnits(balance || 1000, erc20?.decimals)),
                  {
                    shouldValidate: true,
                  },
                );
              }
            }}
          >
            Max
          </button>
        </div>
      </div>

      <div className="flex space-x-4">
        <button type="button" className="third-btn" onClick={() => returnFn()}>
          <FontAwesomeIcon icon={faAngleLeft} className="mr-2" />
          <FormattedMessage id="return" />
        </button>
        <button
          type="submit"
          value="Send"
          className="success-btn"
          disabled={!isValid || isLoading}
        >
          {isLoading ? (
            <Spinner base />
          ) : (
            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
          )}
          <FormattedMessage id="send" />
        </button>
      </div>
    </form>
  );
}

export default AddFundsForm;
