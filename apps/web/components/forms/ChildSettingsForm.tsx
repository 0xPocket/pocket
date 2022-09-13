import { faAngleLeft, faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RadioGroup } from '@headlessui/react';
import { formatUnits } from 'ethers/lib/utils';
import { PocketFaucet } from 'pocket-contract/typechain-types';
import { useEffect, useState } from 'react';

import { z } from 'zod';
import { useSmartContract } from '../../contexts/contract';
import { ContractMethodReturn } from '../../hooks/useContractRead';

import { useZodForm } from '../../utils/useZodForm';

const ChildSettingsSchema = z.object({
  ceiling: z.number({ invalid_type_error: 'Ceiling is required' }).min(1),
  periodicity: z.string(),
});
const periodicity_options = [
  { name: 'weekly', value: '604800' },
  { name: 'monthly', value: '2592000' },
];

type FormValues = z.infer<typeof ChildSettingsSchema>;

type ChildSettingsFormProps = {
  config: ContractMethodReturn<PocketFaucet, 'childToConfig'>;
  withdrawFundsFromChild: () => void;
  changeConfig: (amount: FormValues) => Promise<void>;
  returnFn: () => void;
};

function ChildSettingsForm({
  config,
  withdrawFundsFromChild,
  changeConfig,
  returnFn,
}: ChildSettingsFormProps) {
  const [selected, setSelected] = useState(
    periodicity_options.find(
      (option) =>
        option.value === formatUnits(config.periodicity, 0).toString(),
    ) ?? periodicity_options[0],
  );

  const { erc20 } = useSmartContract();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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

  useEffect(() => {
    setValue('periodicity', selected.value);
  }, [selected, setValue]);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full flex-col items-end justify-between space-y-4"
      >
        <RadioGroup
          value={selected}
          onChange={setSelected}
          className="flex items-center space-x-8"
        >
          <label>Periodicity</label>

          {periodicity_options.map((option) => (
            <RadioGroup.Option
              key={option.name}
              value={option}
              className={({ checked }) =>
                checked ? 'input-radio-checked' : 'input-radio-unchecked'
              }
            >
              {option.name}
            </RadioGroup.Option>
          ))}
        </RadioGroup>

        <div className="flex items-center space-x-8">
          <label htmlFor="topup">Ceiling</label>
          <div className="relative flex  items-center text-4xl">
            <input
              className="input-number"
              placeholder="0"
              type="number"
              min="0"
              {...register('ceiling', {
                valueAsNumber: true,
              })}
            />
            <span>$</span>
            {/* {errors.ceiling && (
              <span className="absolute bottom-0 right-0 translate-y-full rounded border border-danger bg-danger/20 p-1 px-2 text-xs text-white">
                {errors.ceiling.message}
              </span>
            )} */}
          </div>
        </div>

        {/* <button
          className="third-btn mt-4"
          onClick={(e) => {
            e.preventDefault();
            withdrawFundsFromChild();
          }}
        >
          withdraw funds
        </button> */}

        <div className="flex space-x-4">
          <button
            type="button"
            className="third-btn"
            onClick={() => returnFn()}
          >
            <FontAwesomeIcon icon={faAngleLeft} className="mr-2" />
            return
          </button>
          <button type="submit" className="success-btn">
            <FontAwesomeIcon icon={faWrench} className="mr-2" />
            Apply
          </button>
        </div>
      </form>
    </>
  );
}

export default ChildSettingsForm;
