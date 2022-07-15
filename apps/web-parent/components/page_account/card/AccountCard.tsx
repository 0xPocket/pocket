import { UserChild } from '@lib/types/interfaces';
import { ethers } from 'ethers';
import Link from 'next/link';
import AccountStatus from './AccountStatus';

// TODO : find a way to type config
type AccountCardProps = {
  child: UserChild;
  config: any;
};

function AccountCard({ child, config }: AccountCardProps) {
  return (
    <div className="grid grid-cols-2 rounded-lg border border-dark border-opacity-10 bg-white p-8  shadow-lg dark:border-white-darker dark:bg-dark-light">
      <div className="flex flex-col justify-between">
        <div className="flex space-x-4">
          <h1 className="mb-4">{child?.firstName}</h1>
          <AccountStatus child={child} />
        </div>
        <h3>{child.email}</h3>
        <Link
          href={`https://etherscan.io/address/${child.web3Account.address}`}
        >
          <a className="text-primary">See on etherscan</a>
        </Link>
      </div>
      <div className="flex flex-col items-end">
        <p>Balance</p>
        <span className="text-4xl">
          {config?.[1]
            ? ethers.utils.formatUnits(config?.[1], 6).toString()
            : 0}
          $
        </span>
        <p>usdc</p>
      </div>
    </div>
  );
}

export default AccountCard;
