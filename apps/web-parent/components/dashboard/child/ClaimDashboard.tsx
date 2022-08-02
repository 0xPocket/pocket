import React, { useMemo } from 'react';
import { useAccount } from 'wagmi';
import ClaimButton from './ClaimButton';
import ERC20Balance from './ERC20Balance';
import { BigNumber } from 'ethers';
import moment from 'moment';
import { useQuery } from 'react-query';
import useContractRead from '../../../hooks/useContractRead';
import { useSmartContract } from '../../../contexts/contract';
import { strict } from 'assert';

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

  // console.log(data[1].toNumber());

  return (
    <div>
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
      <ERC20Balance />
    </div>
  );
};

export default ClaimDashboard;
