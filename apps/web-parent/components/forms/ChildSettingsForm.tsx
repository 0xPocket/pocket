import { UserChild } from '@lib/types/interfaces';
import { FormErrorMessage } from '@lib/ui';
import { useForm } from 'react-hook-form';

type ChildSettingsFormProps = {
  child: UserChild;
};

type FormValues = {
  topup: number;
  ceiling: number;
  periodicity: number;
};

function ChildSettingsForm({ child }: ChildSettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center justify-between gap-4 rounded-lg bg-dark-light p-4"
    >
      <h2>Settings</h2>
      <div className="flex flex-col">
        <label htmlFor="topup">Add funds to {child.firstName} account</label>
        <input
          className="border p-2"
          min="0"
          placeholder="5 $USDC"
          type="number"
          {...register('topup', {
            min: {
              value: 0,
              message: 'Topup cannot be negative',
            },
            max: {
              value: 20,
              message: 'Insufisant funds',
            },
          })}
        />
        {errors.topup && <FormErrorMessage message={errors.topup.message} />}
      </div>

      <div className="flex flex-col">
        <label htmlFor="topup">Weekly ceiling</label>

        <input
          className="border p-2"
          placeholder="5$USDC"
          min="0"
          {...register('ceiling', {
            min: {
              value: 0,
              message: 'Ceiling cannot be negative',
            },
          })}
          type="number"
        />
        {errors.ceiling && (
          <FormErrorMessage message={errors.ceiling.message} />
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="topup">Periodicity</label>

        <input
          className="border p-2"
          placeholder="Days"
          min="0"
          {...register('periodicity', {
            min: {
              value: 0,
              message: 'Periodicity cannot be negative',
            },
          })}
          type="number"
        />
        {errors.periodicity && (
          <FormErrorMessage message={errors.periodicity.message} />
        )}
      </div>

      <input
        type="submit"
        value="Apply"
        className="rounded-md bg-dark  px-4 py-3 text-bright"
      />
    </form>
  );
}

export default ChildSettingsForm;
