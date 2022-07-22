import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { FormInputText } from '@lib/ui';
import { useRouter } from 'next/router';
import axios, { AxiosError } from 'axios';
import { BackResError } from '@lib/types/interfaces';
import { z } from 'zod';
import { useZodForm } from '../../utils/useZodForm';

type AddChildFormProps = {};

const AddChildSchema = z.object({
  firstName: z.string(),
  email: z.string().email(),
});

type FormValues = z.infer<typeof AddChildSchema>;

function AddChildForm({}: AddChildFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm({
    schema: AddChildSchema,
  });

  const mutation = useMutation(
    (data: FormValues) =>
      axios.put('http://localhost:3000/api/users/parents/children', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('children');
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex gap-4">
        <FormInputText
          type="text"
          placeHolder="Firstname"
          registerValues={register('firstName')}
          error={errors.firstName}
        />
      </div>

      <FormInputText
        placeHolder="john@doe.com"
        registerValues={register('email')}
        type="email"
        error={errors.email}
      />

      <input
        type="submit"
        value="Submit"
        className="rounded-md bg-dark  px-4 py-3 text-bright"
      />
    </form>
  );
}

export default AddChildForm;
