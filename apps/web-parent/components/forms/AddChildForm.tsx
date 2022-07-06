import { useForm } from 'react-hook-form';
import { useAxios } from '../../hooks/axios.hook';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { FormInputText } from '@lib/ui';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { BackResError } from '@lib/types/interfaces';

type AddChildFormProps = {};

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

function AddChildForm({}: AddChildFormProps) {
  const router = useRouter();
  const axios = useAxios();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const mutation = useMutation(
    (data: FormValues) =>
      axios.put('http://localhost:3000/api/users/parents/children', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('children');
        queryClient.invalidateQueries('balance');
        router.push('/dashboard');
        toast.success(`Account created !`);
      },
      onError: (e: AxiosError<BackResError>) => {
        toast.error(e.response?.data.message);
      },
    },
  );

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-opacity- relative flex flex-col justify-end overflow-hidden rounded-lg border border-dark bg-white p-4 shadow-lg dark:border-white-darker dark:bg-dark-light"
    >
      <div className="flex gap-4">
        <FormInputText
          type="text"
          placeHolder="Firstname"
          registerValues={register('firstName', {
            required: 'This field is required',
          })}
          error={errors.firstName}
        />
        <FormInputText
          placeHolder="Lastname"
          registerValues={register('lastName', {
            required: 'This field is required',
          })}
          type="text"
          error={errors.lastName}
        />
      </div>

      <FormInputText
        placeHolder="john@doe.com"
        registerValues={register('email', {
          required: 'This field is required',
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: 'Entered value does not match email format',
          },
        })}
        type="email"
        error={errors.email}
      />

      <input
        type="submit"
        value="Submit"
        className="rounded-md border-dark bg-white p-4 shadow-lg dark:border-white-darker dark:bg-dark-light cursor-pointer px-4 py-3"
      />
    </form>
  );
}

export default AddChildForm;
