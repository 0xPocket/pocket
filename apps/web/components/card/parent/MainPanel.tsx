import {
  faCircleDollarToSlot,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BigNumber } from 'ethers';
import { Dispatch, SetStateAction } from 'react';
import FormattedMessage from '../../common/FormattedMessage';
import Balance from '../common/Balance';

type MainPanelProps = {
  value: BigNumber | undefined;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
};

function MainPanel({ value, setSelectedIndex }: MainPanelProps) {
  return (
    <>
      <Balance balance={value} />
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

export default MainPanel;
