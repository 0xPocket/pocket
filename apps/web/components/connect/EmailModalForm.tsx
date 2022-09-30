import { signIn } from 'next-auth/react';
import { FC, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useAccount, useConnect } from 'wagmi';
import { z } from 'zod';
import { MagicConnector } from '../../utils/MagicConnector';
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

  const magicConnector: MagicConnector = useMemo(
    () => connectors.find((c) => c.id === 'magic'),
    [connectors],
  ) as MagicConnector;

  const onSubmit = async (data: z.infer<typeof EmailSchema>) => {
    try {
      await checkEmail.mutateAsync({
        email: data.email,
      });
    } catch (e) {
      closeModal();
      return;
    }

    const sdk = magicConnector.getMagicSDK();
    await sdk.auth.loginWithMagicLink({
      email: data.email,
    });
    const didToken = await magicConnector.getDidToken();
    if (!didToken) {
      throw new Error('No DID token found.');
    }
    if (!isConnected) {
      await connectAsync({ connector: magicConnector });
    }
    signIn('magic', { token: didToken, callbackUrl: '/' });
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
