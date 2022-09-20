import {
  faCircleDollarToSlot,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { Dispatch, SetStateAction } from 'react';
import { useSmartContract } from '../../../contexts/contract';
import FormattedMessage from '../../common/FormattedMessage';

type BalanceProps = {
  value: BigNumber | undefined;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
};

function Balance({ value, setSelectedIndex }: BalanceProps) {
  const { erc20 } = useSmartContract();

  return (
    <>
      <div className="flex flex-col items-end">
        <p>
          <FormattedMessage id="claimable" />
        </p>
        <span className="text-4xl">
          {value ? formatUnits(value, erc20.data?.decimals).toString() : '0'} $
        </span>
      </div>

      <div className="flex space-x-4">
        <button onClick={() => setSelectedIndex(2)} className="third-btn">
          <FontAwesomeIcon icon={faGear} className="mr-2" />
          <FormattedMessage id="settings" />
        </button>
        <button onClick={() => setSelectedIndex(1)} className="success-btn">
          <FontAwesomeIcon icon={faCircleDollarToSlot} className="mr-2" />
          <FormattedMessage id="card.parent.piggyBank.addFunds" />
        </button>
      </div>
    </>
  );
}

export default Balance;
