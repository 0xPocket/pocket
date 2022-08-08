import React, { useMemo } from 'react';
import { useAccount } from 'wagmi';
import ClaimButton from './ClaimButton';
import ERC20Balance from './ERC20Balance';
import { BigNumber } from 'ethers';
import moment from 'moment';
import { useQuery } from 'react-query';
import useContractRead from '../../../hooks/useContractRead';
import { useSmartContract } from '../../../contexts/contract';
import NftContent from '../../page_account/nft/NftContent';
import TokenContent from '../../page_account/token/TokenContent';
import ActivityChildContent from './ActivityChildContent';
import ChildCardChild from '../../card/childSide/ChildCardChild';

const ClaimDashboard: React.FC = () => {
  const { address } = useAccount();
  const { pocketContract } = useSmartContract();
  const { data: now } = useQuery('now', () => moment(), {
    refetchInterval: 1000,
  });

  const { data } = useContractRead({
    contract: pocketContract,
    functionName: 'childToConfig',
    args: [address!],
  });

  const nextClaim = useMemo(() => {
    if (!data) {
      return;
    }
    const lastClaim = data[3];
    const periodicity = data[4];
    return moment(BigNumber.from(lastClaim).mul(1000).toNumber()).add(
      BigNumber.from(periodicity).toNumber(),
      'seconds',
    );
  }, [data]);

  return address ? (
    <div className="space-y-20">
      <div className="grid grid-cols-2 gap-8">
        <ChildCardChild childAddress={address} className="col-span-1" />
        <ChildCardChild childAddress={address} className="col-span-1" />
      </div>
      <div className="grid grid-cols-2 gap-8">
        <TokenContent childAddress={address!} />
        <NftContent childAddress={address!} fill_nbr={9} />
        <ActivityChildContent childAddress={address!} />
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default ClaimDashboard;
