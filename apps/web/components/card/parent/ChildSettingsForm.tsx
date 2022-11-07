import { faAngleLeft, faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RadioGroup } from '@headlessui/react';
import { formatUnits } from 'ethers/lib/utils';
import { PocketFaucetAbi } from 'pocket-contract/abi';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { z } from 'zod';
import { useSmartContract } from '../../../contexts/contract';
import { ExtractAbiReturnType } from '../../../utils/abi-types';
import { useZodForm } from '../../../utils/useZodForm';
import FormattedMessage from '../../common/FormattedMessage';
import { Spinner } from '../../common/Spinner';
import Tooltip from '../../common/Tooltip';

const ChildSettingsSchema = z.object({
  ceiling: z.number({ invalid_type_error: 'Ceiling is required' }).min(1),
  periodicity: z.string(),
});

type FormValues = z.infer<typeof ChildSettingsSchema>;

type ChildSettingsFormProps = {
  config: ExtractAbiReturnType<typeof PocketFaucetAbi, 'childToConfig'>;
  changeConfig: (amount: FormValues) => Promise<void>;
  returnFn: () => void;
  isLoading: boolean;
};

function ChildSettingsForm({
  config,
  changeConfig,
  returnFn,
  isLoading,
}: ChildSettingsFormProps) {
  const intl = useIntl();

  const periodicity_options = useMemo(
    () => [
      { name: intl.formatMessage({ id: 'weekly' }), value: '604800' },
      { name: intl.formatMessage({ id: 'monthly' }), value: '2592000' },
    ],
    [intl],
  );
  const [selected, setSelected] = useState(
    periodicity_options.find(
      (option) =>
        option.value === formatUnits(config.periodicity, 0).toString(),
    ) ?? periodicity_options[0],
  );

  const { erc20 } = useSmartContract();
  const { register, handleSubmit, setValue } = useZodForm({
    schema: ChildSettingsSchema,
    defaultValues: {
      periodicity: config.periodicity.toString(),
      ceiling: Number(formatUnits(config.ceiling, erc20?.decimals)),
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
                  value={selected}
                  onChange={setSelected}
                  className="flex items-center justify-end  space-x-8"
                >
                  {periodicity_options.map((option) => (
                    <RadioGroup.Option
                      key={option.name}
                      value={option}
                      className={({ checked }) =>
                        checked
                          ? 'input-radio-checked'
                          : 'input-radio-unchecked'
                      }
                    >
                      {option.name}
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
            <FormattedMessage id="return" />
          </button>
          <button
            type="submit"
            className="success-btn"
            disabled={isLoading || !changeConfig}
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
    </>
  );
}

export default ChildSettingsForm;
