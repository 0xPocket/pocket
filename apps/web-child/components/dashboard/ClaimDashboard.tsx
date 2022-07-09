import React, { useEffect, useMemo, useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import PocketFaucetJSON from 'pocket-contract/artifacts/contracts/PocketFaucet.sol/PocketFaucet.json';
import ClaimButton from './ClaimButton';
import ERC20Balance from './ERC20Balance';
import { BigNumber } from 'ethers';
import moment from 'moment';
import { useQuery } from 'react-query';

const ClaimDashboard: React.FC = () => {
  const { address } = useAccount();
  const { data: now } = useQuery('now', () => moment(), {
    refetchInterval: 1000,
  });

  const { data } = useContractRead({
    addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    contractInterface: PocketFaucetJSON.abi,
    functionName: 'childToConfig',
    args: address,
    watch: true,
  });

  const nextClaim = useMemo(() => {
    if (!data) {
      return;
    }
    const lastClaim = data[3];
    console.log(lastClaim.toNumber() * 1000);
    const periodicity = data[4];
    return moment(lastClaim.toNumber() * 1000).add(
      periodicity.toNumber(),
      'seconds',
    );
  }, [data]);

  const canClaim = useMemo(() => {
    if (!now) return false;
    return moment(nextClaim) < now;
  }, [now, nextClaim]);

  // console.log(data[1].toNumber());

  return (
    <div>
      {data && (
        <div className="flex flex-col">
          <div>Balance : {(data[1] as BigNumber).toString()}</div>
          <div>Ceiling : {(data[2] as BigNumber).toString()}</div>
          <div>Last Claim : {(data[3] as BigNumber).toString()}</div>
          <div>Next Claim at {nextClaim?.toLocaleString()}</div>
          <div>Next Claim : {nextClaim?.unix()}</div>
          <div>Now : {now?.unix()}</div>
          <div>Periodicity : {(data[4] as BigNumber).toString()}</div>
        </div>
      )}
      <ClaimButton
        disabled={!canClaim || data[1].toNumber() === 0}
        nextClaim={moment.duration(nextClaim?.diff(now)).humanize()}
      />
      <ERC20Balance />
    </div>
  );
};

export default ClaimDashboard;
