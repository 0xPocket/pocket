import { UserChild } from '@lib/types/interfaces';
import type { FC } from 'react';
import { toast } from 'react-toastify';
import { trpc } from '../../../utils/trpc';
import FormattedMessage from '../../common/FormattedMessage';
import { Spinner } from '../../common/Spinner';

type EmailStatusProps = {
  child: UserChild;
};

const EmailStatus: FC<EmailStatusProps> = ({ child }) => {
  const resendEmail = trpc.useMutation('parent.resendChildVerificationEmail', {
    onError: () => {
      toast.error(<FormattedMessage id="dashboard.parent.card.email-error" />);
    },
    onSuccess: () => {
      toast.success(
        <FormattedMessage
          id="dashboard.parent.card.email-sent-to"
          values={{
            email: child.email,
          }}
        />,
      );
    },
  });

  return (
    <div>
      <FormattedMessage id="dashboard.parent.card.email-sent" />
      {resendEmail.status === 'idle' && (
        <a
          onClick={() => resendEmail.mutate({ userId: child.id })}
          className="ml-2"
        >
          <FormattedMessage id="dashboard.parent.card.send-new" />
        </a>
      )}
      {resendEmail.status === 'loading' && <Spinner />}
      {resendEmail.status === 'success' && (
        <span className="ml-2 text-success">
          <FormattedMessage id="auth.email.resent" />
        </span>
      )}
    </div>
  );
};

export default EmailStatus;
