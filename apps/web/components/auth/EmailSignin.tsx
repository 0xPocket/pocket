import { FC, useMemo } from 'react';
import { useConnect } from 'wagmi';
import { z } from 'zod';
import { useMagic } from '../../contexts/auth';
import { MagicConnector } from '../../utils/MagicConnector';
import { useZodForm } from '../../utils/useZodForm';
import FormattedMessage from '../common/FormattedMessage';

const EmailSchema = z.object({
  email: z.string().email(),
});

const EmailSignin: FC = () => {
  const { connectors } = useConnect();
  const { register, handleSubmit } = useZodForm({
    mode: 'all',
    reValidateMode: 'onChange',
    schema: EmailSchema,
  });

  const magicConnector: MagicConnector = useMemo(
    () => connectors.find((c) => c.id === 'magic'),
    [connectors],
  ) as MagicConnector;

  return (
    <form
      className="flex w-full flex-col items-center justify-center gap-4"
      onSubmit={handleSubmit((data) => magicConnector.connect())}
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
