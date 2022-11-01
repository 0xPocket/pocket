import {
  faCircleDollarToSlot,
  faGear,
  faSquareArrowUpRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserChild } from '@lib/types/interfaces';
import type { BigNumber } from 'ethers';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import FormattedMessage from '../../common/FormattedMessage';
import Balance from '../common/Balance';
import LinkPolygonScan from '../common/LinkPolygonScan';
import MetaMaskProfilePicture from '../common/MetaMaskProfilePicture';
import AccountStatus from './AccountStatus';

type MainPanelProps = {
  child: UserChild;
  value: BigNumber | undefined;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
  polygonScanLink: boolean;
};

function MainPanel({
  child,
  value,
  setSelectedIndex,
  polygonScanLink,
}: MainPanelProps) {
  return (
    <div className="grid h-full grid-cols-2">
      <div className="flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <MetaMaskProfilePicture address={child.address} />
            <div className="flex items-end space-x-4">
              <h1 className="max-w-fit whitespace-nowrap">{child.name}</h1>
              <AccountStatus status="ACTIVE" />
            </div>
          </div>
        </div>
        {polygonScanLink ? (
          <LinkPolygonScan address={child.address!} />
        ) : (
          <Link href={`/account/${child.address}`}>
            <a className="py-3">
              <FontAwesomeIcon icon={faSquareArrowUpRight} className="mr-2" />
              <FormattedMessage
                id="dashboard.parent.card.go-to"
                values={{
                  name: child.name,
                }}
              />
            </a>
          </Link>
        )}
      </div>

      <div className="flex h-full flex-col items-end justify-between">
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
      </div>
    </div>
  );
}

export default MainPanel;
