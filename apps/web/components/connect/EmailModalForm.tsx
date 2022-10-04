// import { signIn } from 'next-auth/react';
import Image from 'next/future/image';
import { FC } from 'react';
import { toast } from 'react-toastify';
import { useAccount, useConnect } from 'wagmi';
import { z } from 'zod';
import { useMagicConnect } from '../../hooks/useMagicConnect';
import { useSignIn } from '../../hooks/useSignIn';
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
  const { signIn } = useSignIn();

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
    });
  };

  return (
    <>
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
      <div className="mt-8 flex items-center justify-center text-xs">
        Powered by{' '}
        <a href="https://magic.link" target="_blank" rel="noreferrer">
          <Image
            src="/assets/providers/magic_logo.svg"
            width={65}
            height={24}
            alt="magic.link"
            className="ml-2"
          />
        </a>
      </div>
    </>
  );
};

export default EmailModalForm;
