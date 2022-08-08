import { useSmartContract } from '../../../contexts/contract';
import useContractRead from '../../../hooks/useContractRead';
import { BigNumber } from 'ethers';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { useAccount, useQuery } from 'wagmi';
import ClaimButton from '../../dashboard/child/ClaimButton';
import ERC20Balance from '../../dashboard/child/ERC20Balance';
import BalanceChild from './BalanceChild';

type ChildCardProps = {
  childAddress: string;
  hasLink?: boolean;
  className?: string;
};

function ChildCardChild({ childAddress, className }: ChildCardProps) {
  const { pocketContract } = useSmartContract();

  const { data: config } = useContractRead({
    contract: pocketContract,
    functionName: 'childToConfig',
    args: [childAddress],
    enabled: !!childAddress,
  });

  const { data: now } = useQuery(['now'], () => moment(), {
    refetchInterval: 1000,
  });

  const nextClaim = useMemo(() => {
    if (!config) return;
    const lastClaim = config[3];
    const periodicity = config[4];
    return moment(BigNumber.from(lastClaim).mul(1000).toNumber()).add(
      BigNumber.from(periodicity).toNumber(),
      'seconds',
    );
  }, [config]);

  const canClaim = useMemo(() => {
    if (!now) return false;
    return moment(nextClaim) < now;
  }, [now, nextClaim]);

  return (
    <div className="space-y-4">
      <h2>My account</h2>
      <div
        className={`${className} container-classic h-4/5 min-h-[260px] rounded-lg p-8`}
      >
        <div className={'flex h-full flex-col justify-between'}>
          <div className={'flex flex-row justify-between'}>
            <ERC20Balance />
            <BalanceChild value={config?.balance} />
          </div>
          {config && (
            <ClaimButton disabled={!canClaim || config[1].isZero()}>
              {!canClaim || config[1].isZero()
                ? config[1].isZero()
                  ? 'No Balance...'
                  : 'Next claim in ' +
                    moment.duration(moment().diff(nextClaim)).humanize() +
                    '...'
                : 'Claim your money !'}
            </ClaimButton>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChildCardChild;
