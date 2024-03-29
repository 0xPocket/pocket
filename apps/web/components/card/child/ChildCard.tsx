import { useSmartContract } from '../../../contexts/contract';
import moment from 'moment';
import { useMemo } from 'react';
import FormattedMessage from '../../common/FormattedMessage';
import { ethers } from 'ethers';
import ClaimButton from './ClaimButton';
import LinkPolygonScan from '../common/LinkPolygonScan';
import MetaMaskProfilePicture from '../common/MetaMaskProfilePicture';
import { useSession } from 'next-auth/react';
import { useAccount, useContractRead } from 'wagmi';
import { env } from 'config/env/client';
import { PocketFaucetAbi } from 'pocket-contract/abi';
import { Address } from 'abitype';
import { useChildConfig } from '../../../hooks/useChildConfig';
import FormattedNumber from '../../common/FormattedNumber';
import { useChildBalance } from '../../../hooks/useChildBalance';
import SettingsDialog from './SettingsDialog';

type ChildCardProps = {
  childAddress: Address;
  hasLink?: boolean;
  className?: string;
};

function ChildCard({ childAddress, className }: ChildCardProps) {
  const { erc20 } = useSmartContract();

  const { data: userData } = useSession();

  const { data: config } = useChildConfig({
    address: childAddress,
  });

  const { address } = useAccount();

  const { data: claimableAmount } = useContractRead({
    address: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: PocketFaucetAbi,
    functionName: 'computeClaimable',
    args: [childAddress],
    enabled: !!childAddress,
    watch: true,
  });

  const { data: balanceWallet } = useChildBalance({
    address: address,
  });

  const nextClaim = useMemo(() => {
    if (!config || config.lastClaim.isZero() || config.balance.isZero()) return;
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
    if (!claimableAmount || !config || config.balance.isZero())
      return <FormattedMessage id="card.child.piggyBank.status.nothing" />;
    const amount = config.balance.gt(config.ceiling)
      ? config.ceiling
      : config.balance;

    return (
      <>
        <FormattedMessage id="withdraw" />
        {' ' +
          Number(
            ethers.utils.formatUnits(amount?.toString(), erc20?.decimals),
          ).toFixed(2) +
          '$'}
      </>
    );
  }, [config, claimableAmount, erc20]);

  return (
    <div className="col-span-6 flex flex-col space-y-8 lg:col-span-3">
      <h2>
        <FormattedMessage id="card.child.title" />
      </h2>
      <div
        className={`${className} container-classic flex h-[250px] flex-col justify-between rounded-lg p-8 md:h-[320px]`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4 sm:gap-0">
          <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-4">
              <MetaMaskProfilePicture
                address={userData?.user.address}
                size={50}
              />
              <div className="flex items-end space-x-4">
                <h1 className="max-w-fit whitespace-nowrap">
                  {userData?.user.name}
                </h1>
              </div>
              {config && <SettingsDialog config={config} />}
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end">
            <p>
              <FormattedMessage id="balance" />
            </p>
            <span className="text-xl sm:text-4xl">
              $<FormattedNumber value={balanceWallet?.value} />
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <LinkPolygonScan address={childAddress} />
          <ClaimButton
            disabled={!canClaim || config?.balance.isZero()}
            nextClaim={nextClaim}
          >
            {textClaim}
          </ClaimButton>
        </div>
      </div>
    </div>
  );
}

export default ChildCard;
