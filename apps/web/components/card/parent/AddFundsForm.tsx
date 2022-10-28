import { faAngleLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { UserChild } from '@lib/types/interfaces';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { useSmartContract } from '../../../contexts/contract';
import useContractRead from '../../../hooks/useContractRead';
import { useAccount } from 'wagmi';
import type { BigNumber } from 'ethers';
import { z } from 'zod';
import { useZodForm } from '../../../utils/useZodForm';
import { useEffect, useState } from 'react';
import FormattedMessage from '../../common/FormattedMessage';
import { useIntl } from 'react-intl';
import { Spinner } from '../../common/Spinner';
import { Config } from 'abitype';
import AddChildForm from '../../dashboard/parent/AddChildForm';

type AddFundsFormProps = {
  child: UserChild;
  addFunds: (amount: BigNumber) => Promise<void>;
  isLoading: boolean;
  config: Config;
  returnFn: () => void;
};

function AddFundsForm({
  child,
  addFunds,
  returnFn,
  isLoading,
  config,
}: AddFundsFormProps) {
  const { erc20 } = useSmartContract();
  const { address } = useAccount();
  const intl = useIntl();
  const [ceiling, setCeiling] = useState('0');
  const [periodicity, setPeriodicity] = useState('0');

  const { data: balance } = useContractRead({
    contract: erc20.contract,
    functionName: 'balanceOf',
    args: [address!],
    enabled: !!address,
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
        Number(formatUnits(balance || 1000, erc20.data?.decimals)),
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
    addFunds(parseUnits(data.topup.toString(), erc20.data?.decimals));
  };

  useEffect(() => {
    setFocus('topup');
  }, [setFocus]);

  // config.periodicity = 0;
  if (config.periodicity !== '0' && periodicity == '0') {
    return <AddChildForm />;
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
            step={1 / 10 ** erc20.data?.decimals!}
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
              {Number(
                formatUnits(balance.toString(), erc20.data?.decimals),
              ).toFixed(2)}
            </span>
          )}
          <button
            className="rounded bg-primary px-2"
            onClick={(e) => {
              e.preventDefault();
              if (!balance?.isZero()) {
                setValue(
                  'topup',
                  Number(formatUnits(balance || 1000, erc20.data?.decimals)),
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
