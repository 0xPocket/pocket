import type { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useSmartContract } from '../../../contexts/contract';
import FormattedMessage from '../../common/FormattedMessage';

type BalanceProps = {
  value: BigNumber | undefined;
};

function PocketMoney({ value }: BalanceProps) {
  const { erc20 } = useSmartContract();

  return (
    <div>
      <p>
        <FormattedMessage id="card.child.piggyBank.title" />
      </p>
      <span className="text-4xl">
        {value ? formatUnits(value, erc20.data?.decimals).toString() : '0'} $
      </span>
    </div>
  );
}

export default PocketMoney;
