import Link from 'next/link';
import { useSmartContract } from '../../contexts/contract';
import useContractRead from '../../hooks/useContractRead';
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

  const { data: config } = useContractRead({
    contract: pocketContract,
    functionName: 'childToConfig',
    args: [child.address],
    watch: true,
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
        {!hasLink ? (
          <Link href={`https://polygonscan.com/address/${child.address}`}>
            <a className="py-3">See on polygonscan</a>
          </Link>
        ) : (
          <Link href={`/account/${child.id}`}>
            <a className="py-3">{`Go to ${child.name}'s profile`}</a>
          </Link>
        )}
      </div>

      <RightTab child={child} config={config} />
    </div>
  );
}

export default ChildCard;
