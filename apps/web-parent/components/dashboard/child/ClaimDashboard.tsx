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
import ChildCardClaim from '../../card/ChildCardClaim';
import { trpc } from '../../../utils/trpc';

const ClaimDashboard: React.FC = () => {
  const { address } = useAccount();
  const { pocketContract } = useSmartContract();
  const { data: now } = useQuery('now', () => moment(), {
    refetchInterval: 1000,
  });

  // const { isLoading, data: children } = trpc.useQuery([]);

  const { data } = useContractRead({
    contract: pocketContract,
    functionName: 'childToConfig',
    args: [address!],
    watch: true,
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

  const canClaim = useMemo(() => {
    if (!now) return false;
    return moment(nextClaim) < now;
  }, [now, nextClaim]);

  return (
    <div>
      <div className="space-y-20">
        <div className="grid grid-cols-6 gap-8">
          {/* <ChildCardClaim child={child} className="col-span-3" /> */}
        </div>

        <TokenContent childAddress={address!} />
      </div>
      {data && (
        <div className="flex flex-col">
          <div>Balance : {(data[1] as BigNumber).toString()}</div>
          <div>Ceiling : {(data[2] as BigNumber).toString()}</div>
          <div>Periodicity : {(data[4] as BigNumber).toString()}</div>
          <div>-</div>
          <div>Last Claim : {(data[3] as BigNumber).toString()}</div>
          <div>
            Last Claim at :{' '}
            {moment(
              (data[3] as BigNumber).mul(1000).toNumber(),
            ).toLocaleString()}
          </div>
          <div>-</div>

          <div>Now : {now?.unix()}</div>
          <div>Now : {now?.toLocaleString()}</div>
          <div>-</div>

          <div>Next Claim : {nextClaim?.unix()}</div>
          <div>Next Claim at {nextClaim?.toLocaleString()}</div>
          <div>-</div>
        </div>
      )}
      {data && (
        <ClaimButton disabled={!canClaim || data[1].isZero()}>
          {!canClaim || data[1].isZero()
            ? data[1].isZero()
              ? 'No Balance...'
              : 'Next claim in ' +
                moment.duration(moment().diff(nextClaim)).humanize() +
                '...'
            : 'Claim your money !'}
        </ClaimButton>
      )}
      <div className="grid grid-cols-2 gap-8">
        <NftContent childAddress={address!} fill_nbr={9} />
        <ActivityChildContent childAddress={address!} />
      </div>

      <ERC20Balance />
    </div>
  );
};

export default ClaimDashboard;
