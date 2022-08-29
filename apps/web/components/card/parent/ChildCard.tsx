import Link from 'next/link';
import { useSmartContract } from '../../../contexts/contract';
import useContractRead from '../../../hooks/useContractRead';
import AccountStatus from './AccountStatus';
import RightTab from './RightTab';
import { UserChild } from '@lib/types/interfaces';

type ChildCardProps = {
  child: UserChild;
  hasLink?: boolean;
  className?: string;
};

function ChildCard({ child, hasLink = false, className }: ChildCardProps) {
  const { pocketContract } = useSmartContract();

  const {
    data: config,
    refetch: refetchConfig,
    error,
  } = useContractRead({
    contract: pocketContract,
    functionName: 'childToConfig',
    args: [child.address!],
    enabled: !!child.address,
  });

  console.log('CHILD ADDRESS', child.address);
  console.log('CHILD config', config, 'error:', error);

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
          <p>You child has received an email to validate his account</p>
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
