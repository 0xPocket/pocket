import { UserChild } from '@lib/types/interfaces';
import { FormErrorMessage } from '@lib/ui';
import { useForm } from 'react-hook-form';

type AddfundsFormProps = {
  child: UserChild;
};

type FormValues = {
  topup: number;
};

function AddfundsForm({ child }: AddfundsFormProps) {
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
      <h2>Add funds</h2>
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
      <input
        type="submit"
        value="Apply"
        className="rounded-md bg-dark  px-4 py-3 text-bright"
      />
    </form>
  );
}

export default AddfundsForm;
