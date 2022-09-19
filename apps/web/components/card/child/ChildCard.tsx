import { useSmartContract } from '../../../contexts/contract';
import useContractRead from '../../../hooks/useContractRead';
import moment from 'moment';
import { useMemo } from 'react';
import ClaimButton from '../../dashboard/child/ClaimButton';
import BaseTokenBalance from '../../common/BaseTokenBalance';
import PocketMoney from './PocketMoney';
import FormattedMessage from '../../common/FormattedMessage';
import { useIntl } from 'react-intl';
import { ethers } from 'ethers';
import { useQuery } from 'react-query';

type ChildCardProps = {
  childAddress: string;
  hasLink?: boolean;
  className?: string;
};

function ChildCard({ childAddress, className }: ChildCardProps) {
  const { pocketContract, erc20 } = useSmartContract();
  const intl = useIntl();

  const { data: config } = useContractRead({
    contract: pocketContract,
    functionName: 'childToConfig',
    args: [childAddress],
    enabled: !!childAddress,
    watch: true,
  });
  const { data: now, refetch } = useQuery(['now'], () => new Date(), {});

  const { data: claimableAmount } = useContractRead({
    contract: pocketContract,
    functionName: 'computeClaimable',
    args: [childAddress],
    enabled: !!childAddress,
    watch: true,
    onSuccess: () => refetch(),
  });

  const nextClaim = useMemo(() => {
    if (!config) return;
    return moment(config.lastClaim.mul(1000).toNumber()).add(
      config.periodicity.toNumber(),
      'seconds',
    );
  }, [config]);

  const canClaim = useMemo(() => {
    if (!claimableAmount) return false;
    return !claimableAmount.isZero();
  }, [claimableAmount]);

  const textClaim = useMemo(() => {
    if (!canClaim && !config?.balance.isZero())
      return (
        <>
          <FormattedMessage id="card.child.piggyBank.status.next" />{' '}
          {moment
            .duration(moment().diff(nextClaim))
            .locale(intl.locale)
            .humanize() + '...'}
        </>
      );
    else if (!canClaim || !claimableAmount)
      return <FormattedMessage id="card.child.piggyBank.status.nothing" />;
    return (
      <>
        <FormattedMessage id="withdraw" />
        {' ' +
          ethers.utils.formatUnits(
            claimableAmount.toString(),
            erc20.data?.decimals,
          ) +
          '$'}
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canClaim, config, claimableAmount, erc20, nextClaim, intl, now]);

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
          <ClaimButton disabled={!canClaim}>{textClaim}</ClaimButton>
        </div>
      </div>
    </div>
  );
}

export default ChildCard;
