import Link from 'next/link';
import { useSmartContract } from '../../../contexts/contract';
import useContractRead from '../../../hooks/useContractRead';
import AccountStatus from './AccountStatus';
import RightTab from './RightTab';
import { UserChild } from '@lib/types/interfaces';
import { trpc } from '../../../utils/trpc';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { useContractWrite } from 'wagmi';
import FormattedMessage from '../../common/FormattedMessage';

type ChildCardProps = {
  child: UserChild;
  hasLink?: boolean;
  className?: string;
};

function ChildCard({ child, hasLink = false, className }: ChildCardProps) {
  const { pocketContract } = useSmartContract();

  const { data: config, refetch: refetchConfig } = useContractRead({
    contract: pocketContract,
    functionName: 'childToConfig',
    args: [child.address!],
    enabled: !!child.address,
    watch: true,
  });

  const { mutate: resendEmail } = trpc.useMutation(
    'parent.resendChildVerificationEmail',
    {
      onError: (e) => {
        toast.error(
          <FormattedMessage id="dashboard.parent.card.email-error" />,
        );
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
    },
  );

  const { write } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: pocketContract.address,
    functionName: 'withdrawFundsFromChild',
    contractInterface: pocketContract.interface,
    args: [config?.balance, child.address],
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
        <button onClick={() => write()}>WITHDRAW FUNDS FROM CHILD</button>
        {child?.child?.status !== 'ACTIVE' ? (
          <p>
            <FormattedMessage id="dashboard.parent.card.email-sent" />
            <button
              className="third-btn"
              onClick={() => resendEmail({ userId: child.id })}
            >
              <FormattedMessage id="dashboard.parent.card.send-new" />
            </button>
          </p>
        ) : !hasLink ? (
          <Link
            //TODO : change mumbai to mainet
            href={`https://mumbai.polygonscan.com/address/${child.address}`}
          >
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
      {child?.child?.status === 'ACTIVE' && (
        <RightTab
          child={child}
          config={config}
          refetchConfig={refetchConfig as any}
        />
      )}
    </div>
  );
}

export default ChildCard;
