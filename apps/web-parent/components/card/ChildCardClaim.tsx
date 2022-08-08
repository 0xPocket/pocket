import Link from 'next/link';
import { useSmartContract } from '../../contexts/contract';
import useContractRead from '../../hooks/useContractRead';
import AccountStatus from './AccountStatus';
import RightTab from './RightTab';
import { UserChild } from '@lib/types/interfaces';

type ChildCardProps = {
  childAddress: string;
  hasLink?: boolean;
  className?: string;
};

function ChildCardClaim({
  childAddress,
  hasLink = false,
  className,
}: ChildCardProps) {
  const { pocketContract } = useSmartContract();

  const { data: config } = useContractRead({
    contract: pocketContract,
    functionName: 'childToConfig',
    args: [childAddress],
    enabled: !!childAddress,
  });

  return (
    <div
      className={`${className} container-classic grid min-h-[260px] grid-cols-2 rounded-lg p-8`}
    >
      <div className="flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex space-x-4">
            <AccountStatus child={child} />
          </div>
        </div>
      </div>

      <RightTab child={child} config={config} />
    </div>
  );
}

export default ChildCardClaim;
