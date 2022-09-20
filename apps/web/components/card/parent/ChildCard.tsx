import Link from 'next/link';
import AccountStatus from './AccountStatus';
import RightTab from './RightTab';
import type { UserChild } from '@lib/types/interfaces';
import { trpc } from '../../../utils/trpc';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import FormattedMessage from '../../common/FormattedMessage';
import { Spinner } from '../../common/Spinner';

type ChildCardProps = {
  child: UserChild;
  hasLink?: boolean;
  className?: string;
};

function ChildCard({ child, hasLink = false, className }: ChildCardProps) {
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
    <div
      className={`${className} container-classic grid min-h-[260px] grid-cols-2 rounded-lg p-8`}
    >
      <div className="flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex space-x-4">
            <h1>{child?.name}</h1>
            <AccountStatus child={child} />
          </div>
        </div>
        {child?.child?.status !== 'ACTIVE' ? (
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
        ) : !hasLink ? (
          <Link href={`https://polygonscan.com/address/${child.address}`}>
            <a className="py-3" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                className="mr-2"
              />
              <FormattedMessage id="dashboard.parent.card.see-on-polygon" />
            </a>
          </Link>
        ) : (
          <Link href={`/account/${child.address}`}>
            <a className="py-3">
              {
                <FormattedMessage
                  id="dashboard.parent.card.go-to"
                  values={{
                    name: child.name,
                  }}
                />
              }
            </a>
          </Link>
        )}
      </div>
      {child?.child?.status === 'ACTIVE' && <RightTab child={child} />}
    </div>
  );
}

export default ChildCard;
