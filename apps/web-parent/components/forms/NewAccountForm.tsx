import { useForm } from 'react-hook-form';
import { useSmartContract } from '../../contexts/contract';
import { useAxios } from '../../hooks/axios.hook';
import { useAuth } from '@lib/nest-auth/next';
import { UserParent } from '@lib/types/interfaces';

type NewAccountFormProps = {
  setIsOpen: () => void;
};

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  publicKey: string;
};

function NewAccountForm({ setIsOpen }: NewAccountFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const { parentContract } = useSmartContract();
  const { user } = useAuth<UserParent>();

  const axios = useAxios();

  const onSubmit = (data: FormValues) => {
    parentContract
      ?.addNewChild(
        {
          active: true,
          parent: user?.wallet.publicKey!,
          ceiling: 20,
          lastClaim: 20,
          balance: 0,
        },
        data.publicKey,
      )
      .then((res) => {
        console.log(res);
      });
    axios
      .put('http://localhost:5000/users/parents/children', data)
      .finally(() => {
        setIsOpen();
      });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-72 flex-col gap-4"
    >
      <div className="flex gap-4">
        <div className="flex flex-col">
          <input
            className="border p-2"
            placeholder="Firstname"
            {...register('firstName', {
              required: 'This field is required',
            })}
            type="text"
          />
          {errors.firstName && (
            <span className="text-sm text-danger">
              {errors.firstName.message}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <input
            className="border p-2"
            placeholder="Lastname"
            {...register('lastName', {
              required: 'This field is required',
            })}
            type="text"
          />
          {errors.lastName && (
            <span className="text-sm text-danger">
              {errors.lastName.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <input
          className="border p-2"
          placeholder="john@doe.com"
          {...register('email', {
            required: 'This field is required',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Entered value does not match email format',
            },
          })}
          type="email"
        />
        {errors.email && (
          <span className="text-sm text-danger">{errors.email.message}</span>
        )}
      </div>

      <div className="flex flex-col">
        <input
          className="border p-2"
          placeholder="Public Key"
          {...register('publicKey', {
            required: 'This field is required',
          })}
          type="text"
        />
        {errors.publicKey && (
          <span className="text-sm text-danger">
            {errors.publicKey.message}
          </span>
        )}
      </div>

      <input
        type="submit"
        value="Submit"
        className="rounded-md bg-dark  px-4 py-3 text-bright"
      />
    </form>
  );
}

export default NewAccountForm;
