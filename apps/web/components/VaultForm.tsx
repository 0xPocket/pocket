import { parseUnits } from 'ethers/lib/utils.js';
import { FC, useEffect } from 'react';
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
    setFocus,
    reset,
  } = useZodForm({
    reValidateMode: 'onChange',
    mode: 'all',
    schema: VaultFormSchema,
  });

  const { addFunds, isLoading } = useAddFunds({
    onSuccess: () => {
      reset();
    },
  });

  const { erc20 } = useSmartContract();

  const { address } = useAccount();

  const { data: erc20Balance } = useBalance({
    address,
    token: erc20?.address,
    watch: true,
  });

  useEffect(() => {
    setFocus('amount');
  }, [setFocus]);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        addFunds({
          childAddress,
          amount: parseUnits(data.amount.toString(), erc20?.decimals),
        });
      })}
      className="flex h-full w-full flex-col items-center justify-center gap-8"
    >
      <div className="space-y-6">
        <p className="font-bold">
          <FormattedMessage id="vault.firsttime.deposit" />
        </p>
        <div className="flex items-center justify-center">
          <input
            className="input-number-bis w-4"
            placeholder="0"
            type="number"
            autoComplete="off"
            min="0"
            onKeyDownCapture={(el) => {
              if (el.key === 'Delete' || el.key === 'Backspace') {
                el.currentTarget.style.width = `${el.currentTarget.value.length}ch`;
              } else {
                el.currentTarget.style.width = `${
                  el.currentTarget.value.length + 1
                }ch`;
              }
            }}
            {...register('amount', {
              valueAsNumber: true,
            })}
          />
          <span>$</span>
        </div>
        {!erc20Balance?.value.isZero() && (
          <div className="flex w-full items-center justify-center gap-2 text-center">
            {erc20Balance && (
              <span className="text-sm text-gray">
                <FormattedMessage id="balance" />: {erc20Balance.formatted}
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
      <button
        type="submit"
        className="action-btn"
        disabled={!isValid || isLoading}
      >
        {isLoading ? <Spinner base /> : <span className="mr-2">🚀</span>}
        <FormattedMessage id="send" />
      </button>
    </form>
  );
};

export default VaultForm;
