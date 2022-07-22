import { faCircleDollarToSlot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ethers } from 'ethers';
import { Dispatch, SetStateAction } from 'react';

type BalanceProps = {
  value: string;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
  hideActions: boolean;
};

function Balance({ value, setSelectedIndex, hideActions }: BalanceProps) {
  return (
    <>
      <div className="flex flex-col items-end">
        {/* <p>Balance</p> */}
        <span className="text-4xl">
          {value ? ethers.utils.formatUnits(value, 6).toString() : '0'} $
        </span>
        <p>usdc</p>
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
