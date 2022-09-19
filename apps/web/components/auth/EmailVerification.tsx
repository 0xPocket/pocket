import { FC } from 'react';
import { trpc } from '../../utils/trpc';
import FormattedMessage from '../common/FormattedMessage';
import { Spinner } from '../common/Spinner';

const EmailVerification: FC = () => {
  const resendEmail = trpc.useMutation(['email.resendVerificationEmail']);

  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-4">
      <p className="text-xl font-bold">
        <FormattedMessage id="auth.email.verify" />
      </p>
      {resendEmail.status === 'idle' && (
        <a
          className="cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            resendEmail.mutateAsync();
          }}
        >
          <FormattedMessage id="auth.email.resend" />
        </a>
      )}
      {resendEmail.status === 'loading' && <Spinner />}
      {resendEmail.status === 'success' && (
        <p className="text-success">
          <FormattedMessage id="auth.email.resent" />
        </p>
      )}
    </div>
  );
};

export default EmailVerification;
