import { useForm } from 'react-hook-form';
import { useAxios } from '../../hooks/axios.hook';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { FormInputText } from '@lib/ui';

type AddChildFormProps = {
  setIsOpen: () => void;
};

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

function AddChildForm({ setIsOpen }: AddChildFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const axios = useAxios();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (data: FormValues) =>
      axios.put('http://localhost:5000/users/parents/children', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('children');
        queryClient.invalidateQueries('balance');
        toast.success(`Account created !`);
      },
      onError: () => {
        toast.error(`DB call went wrong !`);
      },
    },
  );

  const onSubmit = (data: FormValues) => {
    try {
      mutation.mutate(data);
      console.log('Contrat (addNewChild): success !');
    } catch (e) {
      console.error('Contrat (addNewChild): error :', e);
    }
    setIsOpen();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-72 flex-col gap-4"
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
        className="rounded-md bg-dark  px-4 py-3 text-bright"
      />
    </form>
  );
}

export default AddChildForm;
