import type { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import type { FC } from 'react';
import { useSmartContract } from '../../../contexts/contract';
import FormattedMessage from '../../common/FormattedMessage';

type BalanceProps = {
  balance: BigNumber | undefined;
};

const Balance: FC<BalanceProps> = ({ balance }) => {
  const { erc20 } = useSmartContract();

  return (
    <div className="flex flex-col items-end">
      <p>
        <FormattedMessage id="claimable" />
      </p>
      <span className="text-4xl">
        {balance ? formatUnits(balance, erc20.data?.decimals).toString() : '0'}{' '}
        $
      </span>
    </div>
  );
};

export default Balance;
