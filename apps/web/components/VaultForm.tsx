import { parseUnits } from 'ethers/lib/utils.js';
import { FC } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { z } from 'zod';
import { useSmartContract } from '../contexts/contract';
import { useAddFunds } from '../hooks/useAddFunds';
import { useZodForm } from '../utils/useZodForm';
import FormattedMessage from './common/FormattedMessage';
import { Spinner } from './common/Spinner';

const VaultFormSchema = z.object({
  amount: z.number(),
});

type VaultFormProps = {
  childAddress: string;
};

const VaultForm: FC<VaultFormProps> = ({ childAddress }) => {
  const {
    handleSubmit,
    register,
    formState: { isValid },
    setValue,
  } = useZodForm({
    reValidateMode: 'onChange',
    mode: 'all',
    schema: VaultFormSchema,
  });

  const { addFunds } = useAddFunds();

  const { erc20 } = useSmartContract();

  const { address } = useAccount();

  const { data: erc20Balance } = useBalance({
    address,
    token: erc20?.address,
    watch: true,
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        addFunds({
          childAddress,
          amount: parseUnits(data.amount.toString(), erc20?.decimals),
        });
      })}
      className="flex h-full w-full flex-col items-center justify-center gap-12"
    >
      <div className="space-y-6">
        <p className="font-bold">
          Combien voulez vous deposer dans sa tirelire ?
        </p>
        <input
          className="input-number-bis"
          placeholder="0"
          type="number"
          min="0"
          {...register('amount', {
            valueAsNumber: true,
          })}
        />
        <span>$</span>
        {!erc20Balance?.value.isZero() && (
          <div className="flex w-full items-center justify-center gap-2 text-center">
            {erc20Balance && (
              <span className="text-sm text-gray">
                Balance: {erc20Balance.formatted}
              </span>
            )}
            <button
              className="rounded bg-primary px-2 text-sm"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setValue('amount', Number(erc20Balance?.formatted), {
                  shouldValidate: true,
                });
              }}
            >
              Max
            </button>
          </div>
        )}
      </div>
      <button type="submit" className="action-btn" disabled={!isValid}>
        {false ? <Spinner base /> : <span className="mr-2">🚀</span>}
        <FormattedMessage id="send" />
      </button>
    </form>
  );
};

export default VaultForm;
