import { z } from 'zod';
import { useZodForm } from '../../../utils/useZodForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faCoins } from '@fortawesome/free-solid-svg-icons';
import FormattedMessage from '../../common/FormattedMessage';
import { RadioGroup } from '@headlessui/react';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import Tooltip from '../../common/Tooltip';

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
        <p className="text mb-3 text-center  italic">
          <FormattedMessage id="first_set_child_settings" />
        </p>
        <table>
          <tbody className="flex flex-col space-y-4">
            <tr className="flex items-center gap-3 space-x-8">
              <td className="flex gap-3">
                <label>
                  <FormattedMessage id="periodicity" />
                </label>
                <Tooltip>
                  <FormattedMessage id="periodicity.explanation" />
                </Tooltip>
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
              <td className="flex gap-3">
                <label htmlFor="topup">
                  <FormattedMessage id="ceiling" />
                </label>
                <Tooltip>
                  <FormattedMessage id="ceiling.explanation" />
                </Tooltip>
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
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="third-btn"
            onClick={() => returnFn()}
          >
            <FontAwesomeIcon icon={faAngleLeft} className="mr-2" />
            <FormattedMessage id="return" />
          </button>
          <button className="action-btn">
            <FormattedMessage id="next" />
          </button>
        </div>
      </div>
    </form>
  );
}

export default SetChildConfigForm;
