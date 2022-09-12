import Link from 'next/link';
import AccountStatus from './AccountStatus';
import RightTab from './RightTab';
import { UserChild } from '@lib/types/interfaces';
import { trpc } from '../../../utils/trpc';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { useContractWrite } from 'wagmi';
import useContractRead from '../../../hooks/useContractRead';
import { useSmartContract } from '../../../contexts/contract';

type ChildCardProps = {
  child: UserChild;
  hasLink?: boolean;
  className?: string;
};

function ChildCard({ child, hasLink = false, className }: ChildCardProps) {
  const { pocketContract } = useSmartContract();

  const { data: config } = useContractRead({
    contract: pocketContract,
    functionName: 'childToConfig',
    args: [child.address!],
    enabled: !!child.address,
    watch: true,
  });

  const { mutate: resendEmail } = trpc.useMutation(
    'parent.resendChildVerificationEmail',
    {
      onError: () => {
        toast.error(`An error occured, if the problem persits contact us`);
      },
      onSuccess: () => {
        toast.success(`Email sent to ${child.email}`);
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
            {'We sent an email to validate your child account. '}
            <button
              className="third-btn"
              onClick={() => resendEmail({ userId: child.id })}
            >
              Send a new one.
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
              See on polygonscan
            </a>
          </Link>
        ) : (
          <Link href={`/account/${child.address}`}>
            <a className="py-3">{`Go to ${child.name}'s profile`}</a>
          </Link>
        )}
      </div>
      {child?.child?.status === 'ACTIVE' && <RightTab child={child} />}
    </div>
  );
}

export default ChildCard;
