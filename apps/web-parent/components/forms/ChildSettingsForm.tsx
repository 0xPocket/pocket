import { UserChild } from '@lib/types/interfaces';
import { useForm } from 'react-hook-form';
import { useSmartContract } from '../../contexts/contract';

type ChildSettingsFormProps = {
  child: UserChild;
};

type FormValues = {
  topup: number;
  ceiling: number;
};

function ChildSettingsForm({ child }: ChildSettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const { parentContract } = useSmartContract();

  const onSubmit = (data: FormValues) => {
    parentContract
      ?.addFunds(data.topup, child.web3Account.address)
      .then((res) => {
        console.log(res);
      });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-72 flex-col gap-4"
    >
      <div className="flex flex-col">
        <label htmlFor="topup">Add funds to {child.firstName} account</label>
        <input
          className="border p-2"
          min="0"
          placeholder="5 $JEUR"
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
        {errors.topup && (
          <span className="text-sm text-danger">{errors.topup.message}</span>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="topup">Change {child.firstName} weekly ceiling</label>

        <input
          className="border p-2"
          placeholder="5$JEUR"
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
          <span className="text-sm text-danger">{errors.ceiling.message}</span>
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
