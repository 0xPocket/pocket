import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useSmartContract } from '../../../contexts/contract';

type BalanceProps = {
  value: BigNumber | undefined;
};

function BalanceChild({ value }: BalanceProps) {
  const { erc20 } = useSmartContract();
  return (
    <div>
      <p>In the PiggyBank</p>
      <span className="text-4xl">
        {value ? formatUnits(value, erc20.data?.decimals).toString() : '0'} $
      </span>
    </div>
  );
}

export default BalanceChild;
