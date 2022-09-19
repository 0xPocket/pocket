import { faAngleLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserChild } from '@lib/types/interfaces';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { useSmartContract } from '../../../contexts/contract';
import useContractRead from '../../../hooks/useContractRead';
import { useAccount } from 'wagmi';
import type { BigNumber } from 'ethers';
import { z } from 'zod';
import { useZodForm } from '../../../utils/useZodForm';
import { useEffect } from 'react';
import FormattedMessage from '../../common/FormattedMessage';
import { useIntl } from 'react-intl';
import Image from 'next/future/image';

type AddFundsFormProps = {
  child: UserChild;
  addFunds: (amount: BigNumber) => Promise<void>;
  isLoading: boolean;
  returnFn: () => void;
};

function AddFundsForm({
  child,
  addFunds,
  returnFn,
  isLoading,
}: AddFundsFormProps) {
  const { erc20 } = useSmartContract();
  const { address } = useAccount();
  const intl = useIntl();

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
    formState: { errors },
  } = useZodForm({
    schema: ChildSettingsSchema,
  });

  const onSubmit = async (data: FormValues) => {
    addFunds(parseUnits(data.topup.toString(), erc20.data?.decimals));
  };

  useEffect(() => {
    setFocus('topup');
  }, [setFocus]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full flex-col items-end justify-between space-y-4"
    >
      <div className="flex flex-col items-end">
        <label htmlFor="topup">
          {' '}
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
          {errors.topup && (
            <span className="absolute bottom-0 right-0 translate-y-full rounded border border-danger bg-danger/20 p-1 px-2 text-xs text-white">
              {errors.topup.message}
            </span>
          )}
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
          className="relative"
          // className=" success-btn disabled:disabled-btn"
          disabled={isLoading}
        >
          <Image
            src={'/assets/piggy.png'}
            width={500}
            height={500}
            alt={'piggy'}
            className={' face right-0 h-32 w-32 '}
          ></Image>
          {/* <FontAwesomeIcon icon={faPaperPlane} className="mr-2" /> */}
          {/* <FormattedMessage id="send" /> */}
        </button>
      </div>
    </form>
  );
}

export default AddFundsForm;
