import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RadioGroup } from '@headlessui/react';
import { UserChild } from '@lib/types/interfaces';
import { formatUnits } from 'ethers/lib/utils';
import { useEffect } from 'react';
import { z } from 'zod';
import { useSmartContract } from '../contexts/contract';
import { useChildConfig } from '../hooks/useChildConfig';
import { useChildSettingsForm } from '../hooks/useChildSettingsForm';
import { useZodForm } from '../utils/useZodForm';
import FormattedMessage from './common/FormattedMessage';
import { Spinner } from './common/Spinner';
import Tooltip from './common/Tooltip';

const PeriodicityOptions = z.enum(['weekly', 'monthly']);

const PeriodicityValues = {
  weekly: '604800',
  monthly: '2592000',
};

const ChildSettingsSchema = z.object({
  ceiling: z.number({ invalid_type_error: 'Ceiling is required' }).min(1),
  periodicity: PeriodicityOptions,
});

type FormValues = z.infer<typeof ChildSettingsSchema>;

type ChildSettingsFormProps = {
  child: UserChild;
};

function ChildSettingsForm({ child }: ChildSettingsFormProps) {
  const {
    data: config,
    refetch: refetchConfig,
    isLoading,
  } = useChildConfig({
    address: child.address,
  });

  const { changeConfig, isLoading: isLoadingChildSetting } =
    useChildSettingsForm(child.address, !!config?.periodicity.isZero(), () => {
      refetchConfig();
    });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty },
  } = useZodForm({
    schema: ChildSettingsSchema,
  });

  const onSubmit = async (data: FormValues) => {
    changeConfig({
      ceiling: data.ceiling,
      periodicity: PeriodicityValues[data.periodicity],
    });
  };

  const { erc20 } = useSmartContract();

  useEffect(() => {
    if (config) {
      setValue(
        'ceiling',
        Number(formatUnits(config.ceiling, erc20?.decimals)),
        { shouldDirty: false },
      );
      setValue(
        'periodicity',
        config.periodicity.toString() === '604800' ? 'weekly' : 'monthly',
        { shouldDirty: false },
      );
    }
  }, [config, erc20?.decimals, setValue]);

  const periodicity = watch('periodicity');

  if (isLoading) {
    return <Spinner />;
  }

  if (config?.periodicity.isZero()) {
    return null;
  }

  return (
    <div className="container-classic rounded-lg p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full flex-col items-end justify-between space-y-4"
      >
        <table>
          <tbody className="flex flex-col space-y-4">
            <tr className="flex items-center space-x-8">
              <td>
                <label className="flex items-center gap-2">
                  <FormattedMessage id="periodicity" />
                  <Tooltip>
                    <FormattedMessage id="card.parent.settings.periodicity" />
                  </Tooltip>
                </label>
              </td>
              <td className="flex  w-full justify-end">
                <RadioGroup
                  value={periodicity}
                  onChange={(value: 'weekly' | 'monthly') =>
                    setValue('periodicity', value, { shouldDirty: true })
                  }
                  className="flex items-center justify-end  space-x-8"
                >
                  {PeriodicityOptions.options.map((option) => (
                    <RadioGroup.Option
                      key={option}
                      value={option}
                      className={({ checked }) =>
                        checked
                          ? 'input-radio-checked'
                          : 'input-radio-unchecked'
                      }
                    >
                      <FormattedMessage id={option} />
                    </RadioGroup.Option>
                  ))}
                </RadioGroup>
              </td>
            </tr>
            <tr className="flex items-center justify-between">
              <td>
                <label htmlFor="topup" className="flex items-center gap-2">
                  <FormattedMessage id="ceiling" />
                  <Tooltip>
                    <FormattedMessage id="card.parent.settings.ceiling" />
                  </Tooltip>
                </label>
              </td>
              <td className="flex justify-end text-4xl">
                <input
                  className="input-number max-w-[250px]"
                  placeholder="0"
                  type="number"
                  min="0"
                  {...register('ceiling', {
                    valueAsNumber: true,
                  })}
                />
                <span>$</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="success-btn"
            disabled={
              isLoading || !changeConfig || isLoadingChildSetting || !isDirty
            }
          >
            {isLoading ? (
              <Spinner base />
            ) : (
              <FontAwesomeIcon icon={faWrench} className="mr-2" />
            )}
            <FormattedMessage id="apply" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChildSettingsForm;
