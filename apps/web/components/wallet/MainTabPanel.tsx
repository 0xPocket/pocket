import { toast } from 'react-toastify';
import { useAccount, useBalance } from 'wagmi';
import { useSmartContract } from '../../contexts/contract';
import FormattedMessage from '../common/FormattedMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../common/Tooltip';
import { trpc } from '../../utils/trpc';
import useTransak from '../../hooks/useTransak';
import { useSession } from 'next-auth/react';

type MainTabPanelProps = {};

function MainTabPanel({}: MainTabPanelProps) {
  const { address } = useAccount();
  const { erc20 } = useSmartContract();
  const { showTransak } = useTransak();
  const { data, isLoading } = useBalance({
    addressOrName: address,
    token: erc20.data?.address,
    formatUnits: erc20.data?.decimals,
    enabled: !!erc20.data,
    watch: true,
  });
  const { data: maticBalance } = useBalance({
    addressOrName: address,
  });
  const { data: userData, status } = useSession();

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">
          <FormattedMessage id="wallet.my-wallet" />
        </h2>
        {address && (
          <button
            className="action-btn"
            onClick={() => {
              navigator.clipboard.writeText(address);
              toast.success(<FormattedMessage id="wallet.clipboard" />);
            }}
          >
            <FontAwesomeIcon icon={faClipboard} />
          </button>
        )}
      </div>
      <div className="flex flex-col">
        <span>
          <FormattedMessage id="wallet.funds" />
        </span>
        {isLoading ? (
          <h2>
            <FormattedMessage id="loading" />
            ...
          </h2>
        ) : (
          <div className="flex items-end gap-2">
            <h2>{data?.formatted}</h2>
            <span className="text-3xl font-bold">$</span>
            <Tooltip placement="top">
              <FormattedMessage id="tooltip.wallet.erc20" />
            </Tooltip>
          </div>
        )}
        <div className="flex items-end text-xs text-gray">
          <p>
            {maticBalance?.formatted.slice(0, 6)} {maticBalance?.symbol}
          </p>
          <Tooltip placement="top" className="ml-2">
            <FormattedMessage id="tooltip.wallet.matic" />
          </Tooltip>
        </div>
      </div>
      {status === 'authenticated' &&
        userData &&
        userData.user.type === 'Parent' && (
          <button onClick={showTransak} className="action-btn">
            <FormattedMessage id="wallet.top-up" />
          </button>
        )}
    </div>
  );
}

export default MainTabPanel;
