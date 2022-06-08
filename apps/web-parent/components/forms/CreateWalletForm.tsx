import { UserParentWallet } from '.prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { EncryptedWallet, generateWallet } from '../../utils/web3';

type CreateWalletFormProps = {};

type FormValues = {
  password: string;
};

function CreateWalletForm({}: CreateWalletFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: EncryptedWallet) =>
      axios.post<UserParentWallet>('/api/wallet/create', data),
    {
      onSuccess: (res) => {
        queryClient.setQueryData<UserParentWallet>('wallet', () => res.data);
        router.push('/dashboard');
        toast.success(`Wallet created !`);
      },
      onError: () => {
        toast.error(`DB call went wrong !`);
      },
    },
  );

  const onSubmit = (data: FormValues) => {
    const wallet = generateWallet(data.password);

    mutation.mutate(wallet);
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
