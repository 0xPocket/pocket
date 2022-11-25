import { RadioGroup } from '@headlessui/react';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils.js';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { z } from 'zod';
import { useSmartContract } from '../contexts/contract';
import { useAddChildAndFunds } from '../hooks/useAddChildAndFunds';
import { useChildConfig } from '../hooks/useChildConfig';
import useTransak from '../hooks/useTransak';
import { useZodForm } from '../utils/useZodForm';
import FormattedMessage from './common/FormattedMessage';
import { Spinner } from './common/Spinner';
import InputNumber from './InputNumber';
import TransakStatus from './TransakStatus';

const PeriodicityOptions = z.enum(['weekly', 'monthly']);

const PeriodicityValues = {
  weekly: '604800',
  monthly: '2592000',
};

const VaultFormWithTutorialSchema = z.object({
  periodicity: PeriodicityOptions,
  ceiling: z.number(),
  amount: z.number().min(1),
});

type VaultFormWithTutorialProps = {
  childAddress: string;
};

const VaultFormWithTutorial: FC<VaultFormWithTutorialProps> = ({
  childAddress,
}) => {
  const {
    handleSubmit,
    register,
    formState: { isValid },
    setValue,
    watch,
  } = useZodForm({
    reValidateMode: 'onChange',
    mode: 'all',
    schema: VaultFormWithTutorialSchema,
    defaultValues: {
      periodicity: 'weekly',
    },
  });

  const [step, setStep] = useState<'tutorial' | 'form'>('tutorial');

  const { data: childConfig, isLoading: childConfigIsLoading } = useChildConfig(
    { address: childAddress },
  );

  const { status, showTransak } = useTransak();
  const router = useRouter();

  const { addChildAndFunds, isLoading } = useAddChildAndFunds({
    onSuccess: () => {
      router.push(`/account/${childAddress}`);
    },
  });

  const { erc20 } = useSmartContract();

  const { address } = useAccount();

  const { data: erc20Balance } = useBalance({
    address,
    token: erc20?.address,
    watch: true,
  });

  const showTransakButton = erc20Balance?.value.isZero() && !status;

  useEffect(() => {
    if (!childConfig?.periodicity.isZero()) {
      setStep('form');
    }
  }, [childConfig]);

  const periodicity = watch('periodicity');

  if (childConfigIsLoading) {
    return <Spinner />;
  }

  if (step === 'tutorial') {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-8">
        {!status && (
          <>
            <p className="text-center font-bold">
              <FormattedMessage id="vault.tutorial.first" />
            </p>
            <ul className="list-disc space-y-8 px-4">
              <li>
                <FormattedMessage id="vault.tutorial.second" />
              </li>
              <li>
                <FormattedMessage id="vault.tutorial.third" />
              </li>
              <li>
                <FormattedMessage id="vault.tutorial.forth" />
              </li>
            </ul>
          </>
        )}
        <div className="flex flex-col  gap-4">
          {showTransakButton && (
            <button
              onClick={() => showTransak({ tracking: true, autoClose: true })}
              className="action-btn h-14 basis-1/2 rounded-xl font-bold"
            >
              <FormattedMessage id="vault.tutorial.buyUSDC" />
            </button>
          )}
          {status && <TransakStatus status={status} />}
          <button
            className="success-btn h-14 basis-1/2 rounded-xl font-bold"
            onClick={() => setStep('form')}
            disabled={showTransakButton}
          >
            <FormattedMessage id="vault.tutorial.letsgo" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((data) => {
        addChildAndFunds({
          childAddress,
          periodicity: BigNumber.from(PeriodicityValues[data.periodicity]),
          ceiling: parseUnits(data.ceiling.toString(), erc20?.decimals),
          amount: parseUnits(data.amount.toString(), erc20?.decimals),
        });
      })}
      className="flex h-full w-full flex-col items-center justify-center gap-8"
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
        <InputNumber register={register('ceiling', { valueAsNumber: true })} />
      </div>
      <div className="space-y-6">
        <p className="font-bold">
          <FormattedMessage id="vault.firsttime.deposit" />
        </p>
        <InputNumber
          register={register('amount', { valueAsNumber: true })}
          withBalance={!erc20Balance?.value.isZero()}
        />
      </div>
      <button
        type="submit"
        className="action-btn"
        disabled={
          !isValid || isLoading || (status && status !== 'order_completed')
        }
      >
        {isLoading ? <Spinner base /> : <span className="mr-2">🚀</span>}
        <FormattedMessage id="send" />
      </button>
    </form>
  );
};

export default VaultFormWithTutorial;
