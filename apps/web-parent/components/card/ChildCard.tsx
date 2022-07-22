import { UserChild } from '@lib/types/interfaces';
import Link from 'next/link';
import { useContractRead } from 'wagmi';
import { useSmartContract } from '../../contexts/contract';
import AccountStatus from './AccountStatus';
import RightTab from './RightTab';

type ChildCardProps = {
  child: UserChild;
  hasLink?: boolean;
  className?: string;
};

function ChildCard({ child, hasLink = false, className }: ChildCardProps) {
  const { abi } = useSmartContract();

  const { data: config } = useContractRead({
    addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    functionName: 'childToConfig',
    contractInterface: abi,
    args: [child.web3Account.address],
    watch: true,
  });

  return (
    <div
      className={`${className} container-classic grid min-h-[260px] grid-cols-2 rounded-lg p-8`}
    >
      <div className="flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex space-x-4">
            <h1>{child?.firstName}</h1>
            <AccountStatus child={child} />
          </div>
          <h3>{child.email}</h3>
        </div>
        {!hasLink ? (
          <Link
            href={`https://etherscan.io/address/${child.web3Account.address}`}
          >
            <a>See on etherscan</a>
          </Link>
        ) : (
          <Link href={`/account/${child.id}`}>
            <a>{`Go to ${child.firstName}'s profile`}</a>
          </Link>
        )}
      </div>

      <RightTab child={child} config={config} />
    </div>
  );
}

export default ChildCard;
