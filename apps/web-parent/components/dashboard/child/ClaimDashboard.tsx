import React, { useMemo } from 'react';
import { useAccount } from 'wagmi';
import ClaimButton from './ClaimButton';
import ERC20Balance from './ERC20Balance';
import { BigNumber, ethers } from 'ethers';
import moment from 'moment';
import { useQuery } from 'react-query';
import useContractRead from '../../../hooks/useContractRead';
import { useSmartContract } from '../../../contexts/contract';
import Swapper from './Swapper';

const ClaimDashboard: React.FC = () => {
  const { address } = useAccount();
  const { pocketContract, erc20 } = useSmartContract();
  const { data: now } = useQuery('now', () => moment(), {
    refetchInterval: 100000,
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
    return moment(lastClaim.toNumber() * 1000).add(
      periodicity.toNumber(),
      'seconds',
    );
  }, [data]);

  const canClaim = useMemo(() => {
    if (!now) return false;
    return moment(nextClaim) < now;
  }, [now, nextClaim]);

  return (
    <div className="flex space-x-32">
      <div>
        {data && (
          <div className="flex flex-col">
            <div>
              Balance :{' '}
              {ethers.utils
                .formatUnits(data[1], erc20.data?.decimals)
                .toString()}
            </div>
            <div>
              Ceiling :{' '}
              {ethers.utils
                .formatUnits(data[2], erc20.data?.decimals)
                .toString()}
            </div>
            <div>Periodicity : {(data[4] as BigNumber).toString()}</div>
            <div>-</div>
            <div>Last Claim : {(data[3] as BigNumber).toString()}</div>
            <div>
              Last Claim at :{' '}
              {moment(
                (data[3] as BigNumber).toNumber() * 1000,
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
          <ClaimButton disabled={!canClaim || data[1].toNumber() === 0}>
            {!canClaim || data[1].toNumber() === 0
              ? data[1].toNumber() === 0
                ? 'No Balance...'
                : 'Next claim in ' +
                  moment.duration(moment().diff(nextClaim)).humanize() +
                  '...'
              : 'Claim your money !'}
          </ClaimButton>
        )}
        <ERC20Balance />
      </div>
      <Swapper />
    </div>
  );
};

export default ClaimDashboard;
