import { faAngleLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
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

const ChildSettingsSchema = z.object({
  topup: z
    .number({ invalid_type_error: 'Amount is required' })
    .min(1, 'Minimum is 1'),
});

type FormValues = z.infer<typeof ChildSettingsSchema>;

function AddFundsForm({ child, addFunds, returnFn }: AddFundsFormProps) {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useZodForm({
    schema: ChildSettingsSchema,
  });
  const { erc20 } = useSmartContract();
  const { address } = useAccount();

  const { data: balance } = useContractRead({
    contract: erc20.contract,
    functionName: 'balanceOf',
    args: [address!],
    enabled: !!address,
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
      <div className="flex items-center text-4xl">
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
            max: {
              value:
                (balance && formatUnits(balance, erc20.data?.decimals)) || 1000,
              message: 'Insufisant funds',
            },
            valueAsNumber: true,
          })}
        />
        <span>$</span>
      </div>
      {errors.topup && <FormErrorMessage message={errors.topup.message} />}

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
