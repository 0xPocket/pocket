import Link from 'next/link';
import { useSmartContract } from '../../../contexts/contract';
import useContractRead from '../../../hooks/useContractRead';
import AccountStatus from './AccountStatus';
import RightTab from './RightTab';
import { UserChild } from '@lib/types/interfaces';
import { trpc } from '../../../utils/trpc';
import { toast } from 'react-toastify';

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

  const { refetch } = trpc.useQuery(
    ['parent.resendChildVerificationEmail', { userId: child!.id }],
    {
      refetchOnWindowFocus: false,
      enabled: false,
    },
  );

  const resendEmail = async () => {
    if ((await refetch()).status === 'success')
      toast.success(`Email sent to ${child.email}`);
    else toast.error(`An error occured, please reach out the pocket team`);
  };

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
          <p>
            {'We sent an email to validate your child account. '}
            <span
              className="cursor-pointer underline"
              onClick={() => resendEmail()}
            >
              Send a new one.
            </span>
          </p>
        ) : !hasLink ? (
          <Link
            //TODO : change mumbai to mainet
            href={`https://mumbai.polygonscan.com/address/${child.address}`}
          >
            <a className="py-3" target="_blank" rel="noopener noreferrer">
              See on polygonscan
            </a>
          </Link>
        ) : (
          <Link href={`/account/${child.address}`}>
            <a className="py-3">{`Go to ${child.name}'s profile`}</a>
          </Link>
        )}
      </div>
      {child?.child?.status === 'ACTIVE' && (
        <RightTab child={child} config={config} />
      )}
    </div>
  );
}

export default ChildCard;
