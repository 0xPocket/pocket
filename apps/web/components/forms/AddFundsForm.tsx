import {
  faAngleLeft,
  faCaretUp,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserChild } from '@lib/types/interfaces';
import { FormErrorMessage } from '@lib/ui';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { useSmartContract } from '../../contexts/contract';
import useContractRead from '../../hooks/useContractRead';
import { useAccount } from 'wagmi';
import type { BigNumber } from 'ethers';
import { z } from 'zod';
import { useZodForm } from '../../utils/useZodForm';
import { useEffect } from 'react';

type AddFundsFormProps = {
  child: UserChild;
  addFunds: (amount: BigNumber) => Promise<void>;
  returnFn: () => void;
};

function AddFundsForm({ child, addFunds, returnFn }: AddFundsFormProps) {
  const { erc20 } = useSmartContract();
  const { address } = useAccount();

  const { data: balance } = useContractRead({
    contract: erc20.contract,
    functionName: 'balanceOf',
    args: [address!],
    enabled: !!address,
  });

  const ChildSettingsSchema = z.object({
    topup: z
      .number({ invalid_type_error: 'Amount is required' })
      .min(1, 'Minimum is 1')
      .max(
        Number(formatUnits(balance || 1000, erc20.data?.decimals)),
        'Insufficient funds',
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
      <label htmlFor="topup">Add funds to {child.name} account</label>
      <div className="relative  flex items-center text-4xl">
        <div data-tip="This is the text of the tooltip2">
          <input
            className="without-ring appearance-none bg-transparent p-2 text-right text-4xl  text-white outline-none"
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
        </div>
        <span>$</span>
        {errors.topup && (
          <span className="absolute bottom-0 right-0 translate-y-full rounded border border-danger bg-danger/20 p-1 px-2 text-xs text-white">
            {errors.topup.message}
          </span>
        )}
      </div>

      <div className="flex space-x-4">
        <button type="button" className="third-btn" onClick={() => returnFn()}>
          <FontAwesomeIcon icon={faAngleLeft} className="mr-2" />
          return
        </button>
        <button
          type="submit"
          value="Send"
          className="success-btn disabled:disabled-btn"
        >
          <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
          Send
        </button>
      </div>
    </form>
  );
}

export default AddFundsForm;
