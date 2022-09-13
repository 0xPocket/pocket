import { faAngleLeft, faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormErrorMessage } from '@lib/ui';
import { formatUnits } from 'ethers/lib/utils';
import { PocketFaucet } from 'pocket-contract/typechain-types';

import { z } from 'zod';
import { useSmartContract } from '../../contexts/contract';
import { ContractMethodReturn } from '../../hooks/useContractRead';

import { useZodForm } from '../../utils/useZodForm';
import FormattedMessage from '../common/FormattedMessage';

const ChildSettingsSchema = z.object({
  ceiling: z.number({ invalid_type_error: 'Ceiling is required' }).min(1),
  periodicity: z.string(),
});

type FormValues = z.infer<typeof ChildSettingsSchema>;

type ChildSettingsFormProps = {
  config: ContractMethodReturn<PocketFaucet, 'childToConfig'>;
  changeConfig: (amount: FormValues) => Promise<void>;
  returnFn: () => void;
};

function ChildSettingsForm({
  config,
  changeConfig,
  returnFn,
}: ChildSettingsFormProps) {
  const { erc20 } = useSmartContract();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm({
    schema: ChildSettingsSchema,
    defaultValues: {
      periodicity: formatUnits(config.periodicity, 0).toString(),
      ceiling: Number(formatUnits(config.ceiling, erc20.data?.decimals)),
    },
  });

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    changeConfig(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full flex-col items-end justify-between space-y-4"
    >
      <div className="flex items-center space-x-8">
        <label>
          <FormattedMessage id="periodicity" />
        </label>
        <div className="flex flex-col space-x-2">
          <input
            type="radio"
            id="weekly"
            value="604800"
            {...register('periodicity')}
          />
          <label htmlFor="huey">
            <FormattedMessage id="weekly" />
          </label>
        </div>

        <div className="flex flex-col space-x-2">
          <input
            type="radio"
            id="monthly"
            value="2592000"
            {...register('periodicity')}
          />
          <label htmlFor="dewey">
            <FormattedMessage id="monthly" />
          </label>
        </div>
      </div>
      <div className="flex items-center space-x-8">
        <label htmlFor="topup">
          <FormattedMessage id="ceiling" />
        </label>
        <input
          className="border p-2 text-dark"
          {...register('ceiling', {
            valueAsNumber: true,
          })}
          type="number"
        />
        {errors.ceiling && (
          <FormErrorMessage message={errors.ceiling.message} />
        )}
      </div>

      <div className="flex space-x-4">
        <button type="button" className="third-btn" onClick={() => returnFn()}>
          <FontAwesomeIcon icon={faAngleLeft} className="mr-2" />
          <FormattedMessage id="return" />
        </button>
        <button type="submit" className="success-btn">
          <FontAwesomeIcon icon={faWrench} className="mr-2" />
          <FormattedMessage id="apply" />
        </button>
      </div>
    </form>
  );
}

export default ChildSettingsForm;
