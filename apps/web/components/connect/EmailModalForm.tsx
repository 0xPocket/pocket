import { signIn } from 'next-auth/react';
import { FC } from 'react';
import { toast } from 'react-toastify';
import { useAccount, useConnect } from 'wagmi';
import { z } from 'zod';
import { useMagicConnect } from '../../hooks/useMagicConnect';
import { trpc } from '../../utils/trpc';
import { useZodForm } from '../../utils/useZodForm';
import FormattedMessage from '../common/FormattedMessage';

const EmailSchema = z.object({
  email: z.string().email(),
});

type EmailModalFormProps = {
  closeModal: () => void;
};

const EmailModalForm: FC<EmailModalFormProps> = ({ closeModal }) => {
  const { isConnected } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const { register, handleSubmit, formState } = useZodForm({
    mode: 'all',
    reValidateMode: 'onChange',
    schema: EmailSchema,
  });

  const checkEmail = trpc.useMutation('connect.connect', {
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const magicSignIn = useMagicConnect();

  const onSubmit = async (data: z.infer<typeof EmailSchema>) => {
    try {
      await checkEmail.mutateAsync({
        email: data.email,
      });
    } catch (e) {
      closeModal();
      return;
    }

    const didToken = await magicSignIn.mutateAsync(data.email);

    if (!isConnected) {
      await connectAsync({
        connector: connectors.find((c) => c.id === 'magic'),
      });
    }

    signIn('magic', {
      token: didToken,
      redirect: false,
    }).then((res) => {
      if (res?.ok) {
        window.location.href = '/';
      } else {
        toast.error(res?.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
      <input
        {...register('email')}
        className="input-text w-48"
        autoComplete="email"
        placeholder="my@email.com"
      />
      <button
        type="submit"
        className={`action-btn flex-none`}
        disabled={!formState.isValid}
      >
        <FormattedMessage id="signIn" />
      </button>
    </form>
  );
};

export default EmailModalForm;
