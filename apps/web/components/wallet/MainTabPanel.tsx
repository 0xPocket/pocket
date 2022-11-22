import { toast } from 'react-toastify';
import { useAccount, useBalance } from 'wagmi';
import { useSmartContract } from '../../contexts/contract';
import FormattedMessage from '../common/FormattedMessage';
import Tooltip from '../common/Tooltip';
import useTransak from '../../hooks/useTransak';
import { useSession } from 'next-auth/react';
import { Spinner } from '../common/Spinner';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import TokenInfo from './TokenInfo';
import FormattedNumber from '../common/FormattedNumber';

type MainTabPanelProps = {};

function MainTabPanel({}: MainTabPanelProps) {
  const { address } = useAccount();
  const { erc20 } = useSmartContract();
  const { showTransak } = useTransak();
  const { data, isLoading } = useBalance({
    address,
    token: erc20?.address,
    formatUnits: erc20?.decimals,
    enabled: !!erc20,
    watch: true,
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
            <Tooltip icon={faCopy} placement="top">
              <p>Copy address to clipboard</p>
            </Tooltip>
          </button>
        )}
      </div>
      <div className="flex flex-col">
        <span>
          <FormattedMessage id="wallet.funds" />
        </span>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">$</span>
            <h2 className="number">
              <FormattedNumber value={data?.value} />
            </h2>
            <Tooltip placement="top">
              <FormattedMessage id="tooltip.wallet.erc20" />
            </Tooltip>
          </div>
        )}
      </div>
      <TokenInfo />
      {status === 'authenticated' &&
        userData &&
        userData.user.type === 'Parent' && (
          <button onClick={() => showTransak({})} className="action-btn">
            <FormattedMessage id="wallet.top-up" />
          </button>
        )}
    </div>
  );
}

export default MainTabPanel;
