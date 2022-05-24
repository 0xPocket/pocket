import axios from 'axios';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type CreateWalletFormProps = {};

type FormValues = {
  privateKey: string;
  password: string;
};

function CreateWalletForm({}: CreateWalletFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const router = useRouter();
  const onSubmit = (data: FormValues) => {
    axios
      .post('/api/wallet/create', {
        password: data.password,
        privateKey: 'agaadga',
      })
      .catch(() => toast.error('Invalid password'))
      .then(() => router.push('/dashboard'));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-72 flex-col gap-4"
    >
      <div className="flex flex-col">
        <input
          className="border p-2"
          placeholder="password"
          {...register('password', {
            required: 'This field is required',
          })}
          type="password"
        />
        {errors.password && (
          <span className="text-sm text-danger">{errors.password.message}</span>
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

export default CreateWalletForm;
