import { faCircleDollarToSlot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { Dispatch, SetStateAction } from 'react';
import { useSmartContract } from '../../contexts/contract';

type BalanceProps = {
  value: BigNumber | undefined;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
  hideActions: boolean;
};

function Balance({ value, setSelectedIndex, hideActions }: BalanceProps) {
  const { erc20 } = useSmartContract();
  return (
    <>
      <div className="flex flex-col items-end">
        <p>PiggyBank</p>
        <span className="text-4xl">
          {value ? formatUnits(value, erc20.data?.decimals).toString() : '0'} $
        </span>
      </div>
      {!hideActions && (
        <div className="flex space-x-4">
          <button onClick={() => setSelectedIndex(2)} className="text-primary">
            settings
          </button>
          <button onClick={() => setSelectedIndex(1)} className="success-btn">
            <FontAwesomeIcon icon={faCircleDollarToSlot} className="mr-2" />
            add funds
          </button>
        </div>
      )}
    </>
  );
}

export default Balance;
