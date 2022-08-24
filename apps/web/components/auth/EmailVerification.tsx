import { FC } from 'react';
import { trpc } from '../../utils/trpc';
import { Spinner } from '../common/Spinner';

const EmailVerification: FC = () => {
  const resendEmail = trpc.useMutation(['email.resendVerificationEmail']);

  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-4">
      <p className="text-xl font-bold">
        Please verify your email with the link we sent you.
      </p>
      {resendEmail.status === 'idle' && (
        <a
          className="cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            resendEmail.mutateAsync();
          }}
        >
          {"Didn't received any email? Click here to resend a new one."}
        </a>
      )}
      {resendEmail.status === 'loading' && <Spinner />}
      {resendEmail.status === 'success' && (
        <p className="text-success">New email sent !</p>
      )}
    </div>
  );
};

export default EmailVerification;
