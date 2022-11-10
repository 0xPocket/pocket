import type { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useSession } from 'next-auth/react';
import type { FC } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { useSmartContract } from '../../../contexts/contract';
import FormattedMessage from '../../common/FormattedMessage';

type BalanceProps = {
  balance: BigNumber | undefined;
};

const Balance: FC<BalanceProps> = ({ balance }) => {
  const { erc20 } = useSmartContract();
  const { address } = useAccount();
  const { data: session } = useSession();
  const { data: balanceWallet } = useBalance({
    address,
    token: erc20?.address,
    formatUnits: erc20?.decimals,
    enabled: !!erc20,
    watch: true,
  });

  return (
    <div className="flex flex-col items-end">
      <p>
        <FormattedMessage id="claimable" />
      </p>
      <span className="text-4xl">
        {balance
          ? Number(formatUnits(balance, erc20?.decimals)).toFixed(2)
          : '0.00'}{' '}
        $
      </span>
      {balanceWallet && session?.user.type === 'Child' && (
        <span className="text-gray">
          Balance:{' '}
          {Number(formatUnits(balanceWallet.value, erc20?.decimals)).toFixed(2)}
          $
        </span>
      )}
    </div>
  );
};

export default Balance;
