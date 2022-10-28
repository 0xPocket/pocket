import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { useZodForm } from '../../../utils/useZodForm';
import { trpc } from '../../../utils/trpc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faCoins } from '@fortawesome/free-solid-svg-icons';
import FormattedMessage from '../../common/FormattedMessage';
import { RadioGroup } from '@headlessui/react';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { formatUnits } from 'ethers/lib/utils';

type SetChildConfigFormProps = {
  setCeiling: Dispatch<SetStateAction<string>>;
  setPeriodicity: Dispatch<SetStateAction<string>>;
  returnFn: () => void;
};

const ChildSettingsSchema = z.object({
  ceiling: z.number({ invalid_type_error: 'Ceiling is required' }).min(1),
  periodicity: z.string(),
});
type FormValues = z.infer<typeof ChildSettingsSchema>;

function SetChildConfigForm({
  setCeiling,
  setPeriodicity,
  returnFn,
}: SetChildConfigFormProps) {
  const intl = useIntl();

  const periodicity_options = useMemo(
    () => [
      { name: intl.formatMessage({ id: 'weekly' }), value: '604800' },
      { name: intl.formatMessage({ id: 'monthly' }), value: '2592000' },
    ],
    [intl],
  );

  const { register, handleSubmit, setValue } = useZodForm({
    schema: ChildSettingsSchema,
    defaultValues: {
      periodicity: '0',
    },
  });

  const [selected, setSelected] = useState(periodicity_options[0]);

  useEffect(() => {
    setValue('periodicity', selected.value);
  }, [selected, setValue]);

  const onSubmit = async (data: FormValues) => {
    console.log(data.ceiling.toString());
    console.log(selected.value);

    setCeiling(data.ceiling.toString());
    setPeriodicity(selected.value);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-lg"
    >
      <div className="flex flex-grow flex-col justify-evenly gap-4">
        <h2>
          <FontAwesomeIcon icon={faCoins} className="mr-4" />
          <FormattedMessage id="account.settings" />
        </h2>
        <table>
          <tbody className="flex flex-col space-y-4">
            <tr className="flex items-center space-x-8">
              <td>
                <label>
                  <FormattedMessage id="periodicity" />
                </label>
              </td>
              <td className="flex flex-grow justify-end">
                <RadioGroup
                  value={selected}
                  onChange={setSelected}
                  className="flex items-center space-x-8"
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
                <label htmlFor="topup">
                  <FormattedMessage id="ceiling" />
                </label>
              </td>
              <td className="flex justify-end text-4xl">
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
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex space-x-4">
          <button
            type="button"
            className="third-btn"
            onClick={() => returnFn()}
          >
            <FontAwesomeIcon icon={faAngleLeft} className="mr-2" />
            <FormattedMessage id="return" />
          </button>
          <button className="action-btn">
            <FormattedMessage id="submit" />
          </button>
        </div>
      </div>
    </form>
  );
}

export default SetChildConfigForm;
