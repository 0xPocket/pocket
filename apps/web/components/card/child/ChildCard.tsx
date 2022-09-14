import { useSmartContract } from '../../../contexts/contract';
import useContractRead from '../../../hooks/useContractRead';
import moment from 'moment';
import { useMemo } from 'react';
import { useQuery } from 'wagmi';
import ClaimButton from '../../dashboard/child/ClaimButton';
import BaseTokenBalance from '../../common/BaseTokenBalance';
import PocketMoney from './PocketMoney';
import FormattedMessage from '../../common/FormattedMessage';

type ChildCardProps = {
  childAddress: string;
  hasLink?: boolean;
  className?: string;
};

function ChildCard({ childAddress, className }: ChildCardProps) {
  const { pocketContract } = useSmartContract();

  const { data: config } = useContractRead({
    contract: pocketContract,
    functionName: 'childToConfig',
    args: [childAddress],
    enabled: !!childAddress,
    watch: true,
  });

  const { data: now } = useQuery(['now'], () => moment(), {
    refetchInterval: 1000,
  });

  const nextClaim = useMemo(() => {
    if (!config) return;
    const lastClaim = config[3];
    const periodicity = config[4];
    return moment(lastClaim.mul(1000).toNumber()).add(
      periodicity.toNumber(),
      'seconds',
    );
  }, [config]);

  const canClaim = useMemo(() => {
    if (!now) return false;
    return moment(nextClaim) < now;
  }, [now, nextClaim]);

  return (
    <div className="space-y-4">
      <h2>
        <FormattedMessage id="card.child.title" />
      </h2>
      <div
        className={`${className} container-classic h-4/5 min-h-[260px] rounded-lg p-8`}
      >
        <div className={'flex h-full flex-col justify-between'}>
          <div className={'flex flex-row justify-between'}>
            <BaseTokenBalance />
            <PocketMoney value={config?.balance} />
          </div>
          {config && (
            <ClaimButton disabled={!canClaim || config[1].isZero()}>
              {!canClaim || config[1].isZero() ? (
                config[1].isZero() ? (
                  <FormattedMessage id="card.child.piggyBank.status.nothing" />
                ) : (
                  <FormattedMessage id="card.child.piggyBank.status.next" /> +
                  moment.duration(moment().diff(nextClaim)).humanize() +
                  '...'
                )
              ) : (
                <FormattedMessage id="claim" />
              )}
            </ClaimButton>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChildCard;
