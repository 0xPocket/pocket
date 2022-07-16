import { Tab } from '@headlessui/react';
import { UserChild } from '@lib/types/interfaces';
import { ethers } from 'ethers';
import Link from 'next/link';
import { Router, useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { useSmartContract } from '../../contexts/contract';
import AccountStatus from './AccountStatus';
import RightTab from './RightTab';

type ChildCardProps = {
  child: UserChild;
  asLink?: boolean;
};

function ChildCard({ child, asLink = false }: ChildCardProps) {
  const { contract } = useSmartContract();
  const router = useRouter();

  const { data: config } = useQuery(
    ['config', child.id],
    async () => await contract?.childToConfig(child!.web3Account.address),
    {
      staleTime: 60 * 1000,
    },
  );
  return (
    <div
      className={`container-classic grid grid-cols-2 rounded-lg p-8 ${
        asLink && 'cursor-pointer transition-transform hover:scale-105'
      }`}
      onClick={() => {
        if (asLink) router.push('/account/' + child.id);
      }}
    >
      <div className="flex flex-col justify-between">
        <div className="flex space-x-4">
          <h1>{child?.firstName}</h1>
          <AccountStatus child={child} />
        </div>
        <h3>{child.email}</h3>
        <Link
          href={`https://etherscan.io/address/${child.web3Account.address}`}
        >
          <a className="text-primary">See on etherscan</a>
        </Link>
      </div>

      <RightTab config={config} />
    </div>
  );
}

export default ChildCard;
