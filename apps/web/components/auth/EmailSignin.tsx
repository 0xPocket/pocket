import { signIn } from 'next-auth/react';
import { FC, useMemo } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { z } from 'zod';
import { useMagic } from '../../contexts/auth';
import { MagicConnector } from '../../utils/MagicConnector';
import { useZodForm } from '../../utils/useZodForm';
import FormattedMessage from '../common/FormattedMessage';

const EmailSchema = z.object({
  email: z.string().email(),
});

const EmailSignin: FC = () => {
  const { connectors, connectAsync } = useConnect();
  const { connector, isConnected } = useAccount();
  const { register, handleSubmit } = useZodForm({
    mode: 'all',
    reValidateMode: 'onChange',
    schema: EmailSchema,
  });

  const magicConnector: MagicConnector = useMemo(
    () => connectors.find((c) => c.id === 'magic'),
    [connectors],
  ) as MagicConnector;

  const onSubmit = async (data: z.infer<typeof EmailSchema>) => {
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
    <form
      className="flex w-full flex-col items-center justify-center gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p>
        <FormattedMessage id="auth.email.connect" />
      </p>
      <div className="flex gap-2">
        <input
          {...register('email')}
          className="input-text"
          autoComplete="email"
          placeholder="my@email.com"
        />
        <button type="submit" className={`action-btn flex-none`}>
          <FormattedMessage id="signIn" />
        </button>
      </div>
    </form>
  );
};

export default EmailSignin;
