import { RadioGroup } from '@headlessui/react';
import { BigNumber } from 'ethers';
import { FC } from 'react';
import { z } from 'zod';
import { useAddChildAndFunds } from '../hooks/useAddChildAndFunds';
import { useZodForm } from '../utils/useZodForm';
import FormattedMessage from './common/FormattedMessage';
import { Spinner } from './common/Spinner';

const PeriodicityOptions = z.enum(['weekly', 'monthly']);

const PeriodicityValues = {
  weekly: '604800',
  monthly: '2592000',
};

const VaultFormSchema = z.object({
  periodicity: PeriodicityOptions,
  ceiling: z.number(),
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
    watch,
  } = useZodForm({
    reValidateMode: 'onChange',
    mode: 'all',
    schema: VaultFormSchema,
    defaultValues: {
      periodicity: 'weekly',
    },
  });

  const { addChildAndFunds } = useAddChildAndFunds();

  const periodicity = watch('periodicity');

  return (
    <form
      onSubmit={handleSubmit((data) => {
        addChildAndFunds({
          childAddress,
          periodicity: BigNumber.from(PeriodicityValues[data.periodicity]),
          ceiling: BigNumber.from(data.ceiling),
          amount: BigNumber.from(data.amount),
        });
      })}
      className="flex h-full w-full flex-col items-center justify-center gap-12"
    >
      <div className="space-y-6">
        <p className="font-bold">
          <FormattedMessage id="vault.firsttime.frequency" />
        </p>
        <RadioGroup<'div', 'weekly' | 'monthly'>
          value={periodicity}
          onChange={(value: 'weekly' | 'monthly') =>
            setValue('periodicity', value)
          }
          className="flex w-full items-center justify-center  space-x-8"
        >
          {PeriodicityOptions.options.map((option) => (
            <RadioGroup.Option
              key={option}
              value={option}
              className={({ checked }) =>
                checked ? 'input-radio-checked' : 'input-radio-unchecked'
              }
            >
              <FormattedMessage id={option} />
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      </div>
      <div className="space-y-6">
        <p className="font-bold">
          <FormattedMessage id="vault.firsttime.howmuch" />
        </p>
        <input
          className="input-number-bis"
          placeholder="0"
          type="number"
          min="0"
          {...register('ceiling', {
            valueAsNumber: true,
          })}
        />
        <span>$</span>
      </div>
      <div className="space-y-6">
        <p className="font-bold">
          <FormattedMessage id="vault.firsttime.deposit" />
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
      </div>
      <button type="submit" className="action-btn">
        {false ? <Spinner base /> : <span className="mr-2">🚀</span>}
        <FormattedMessage id="send" />
      </button>
    </form>
  );
};

export default VaultForm;
