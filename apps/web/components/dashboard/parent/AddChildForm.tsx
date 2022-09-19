import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { useZodForm } from '../../../utils/useZodForm';
import { trpc } from '../../../utils/trpc';
import { ParentSchema } from '../../../server/schemas';
import InputText from '../../common/InputText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import FormattedMessage from '../../common/FormattedMessage';
import { RadioGroup } from '@headlessui/react';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

type FormValues = z.infer<typeof ParentSchema['createChild']>;

function AddChildForm() {
  const router = useRouter();
  const queryClient = trpc.useContext();
  const intl = useIntl();

  const periodicity_options = useMemo(
    () => [
      { name: intl.formatMessage({ id: 'weekly' }), value: '604800' },
      { name: intl.formatMessage({ id: 'monthly' }), value: '2592000' },
    ],
    [intl],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useZodForm({
    schema: ParentSchema['createChild'],
    defaultValues: {
      periodicity: periodicity_options[0].value,
    },
  });

  const addChild = trpc.useMutation(['parent.createChild'], {
    onSuccess: () => {
      queryClient.invalidateQueries('parent.children');
      router.push('/');
      toast.success(<FormattedMessage id="child-form.created" />);
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const onSubmit = (data: FormValues) => {
    addChild.mutate(data);
  };

  const [selected, setSelected] = useState(periodicity_options[0]);

  useEffect(() => {
    setValue('periodicity', selected.value);
  }, [selected, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="container-classic flex flex-col gap-4 rounded-lg p-8"
    >
      <h2 className="">
        <FontAwesomeIcon icon={faPlus} className="mr-4" />
        <FormattedMessage id="child-form.info" />
      </h2>
      <div className="flex flex-grow flex-col justify-evenly">
        <InputText
          label={<FormattedMessage id="name" />}
          register={register('name')}
        />
        <InputText
          label={<FormattedMessage id="email" />}
          register={register('email')}
        />
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
        <button disabled={addChild.isLoading} className="action-btn">
          <FormattedMessage id="send" />
        </button>
      </div>
    </form>
  );
}

export default AddChildForm;
