import { useSmartContract } from '../../../contexts/contract';
import useContractRead from '../../../hooks/useContractRead';
import moment from 'moment';
import { useMemo } from 'react';
import { useQuery } from 'wagmi';
import ClaimButton from './ClaimButton';
import FormattedMessage from '../../common/FormattedMessage';
import { useIntl } from 'react-intl';
import { trpc } from '../../../utils/trpc';
import LinkPolygonScan from '../common/LinkPolygonScan';
import Balance from '../common/Balance';

type ChildCardProps = {
  childAddress: string;
  hasLink?: boolean;
  className?: string;
};

function ChildCard({ childAddress, className }: ChildCardProps) {
  const { pocketContract } = useSmartContract();
  const intl = useIntl();

  const { data: userData, isLoading: userDataLoading } = trpc.useQuery([
    'auth.session',
  ]);

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
    <div className="flex flex-col space-y-4">
      <h2>
        <FormattedMessage id="card.child.title" />
      </h2>
      <div
        className={`${className} container-classic grid h-full grid-cols-2 rounded-lg p-8`}
      >
        <div className="flex h-full flex-col items-start justify-between">
          <h1>{userData?.user.name}</h1>
          <LinkPolygonScan address={childAddress} />
        </div>
        <div className="flex h-full flex-col items-end justify-between">
          <Balance balance={config?.balance} />
          {config && (
            <ClaimButton disabled={!canClaim || config[1].isZero()}>
              {!canClaim || config[1].isZero() ? (
                config[1].isZero() ? (
                  <FormattedMessage id="card.child.piggyBank.status.nothing" />
                ) : (
                  <>
                    <FormattedMessage id="card.child.piggyBank.status.next" />{' '}
                    {moment
                      .duration(moment().diff(nextClaim))
                      .locale(intl.locale)
                      .humanize() + '...'}
                  </>
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
