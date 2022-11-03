import type { FC } from 'react';
import FormattedMessage from '../../common/FormattedMessage';
import { toast } from 'react-toastify';
import { useAccount, useBalance } from 'wagmi';
import { useSmartContract } from '../../../contexts/contract';

import useTransak from '../../../hooks/useTransak';
import { Spinner } from '../../common/Spinner';
import Tooltip from '../../common/Tooltip';
import { faCopy } from '@fortawesome/free-regular-svg-icons';

const MyAccountCard: FC = () => {
  const { address } = useAccount();
  const { erc20 } = useSmartContract();
  const { showTransak } = useTransak();
  const { data, isLoading, isIdle } = useBalance({
    addressOrName: address,
    token: erc20.data?.address,
    formatUnits: erc20.data?.decimals,
    enabled: !!erc20.data,
    watch: true,
  });

  return (
    <div className="container-classic flex w-full max-w-[350px] flex-col gap-6 rounded-lg p-8">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span>
            <FormattedMessage id="wallet.funds" />
          </span>
          {isLoading || isIdle ? (
            <Spinner />
          ) : (
            <div className="flex items-end gap-2">
              <h2 className="number">{Number(data?.formatted).toFixed(2)}</h2>
              <span className="text-3xl font-bold">$</span>
              <Tooltip placement="top">
                <FormattedMessage id="tooltip.wallet.erc20" />
              </Tooltip>
            </div>
          )}
        </div>
        {address && (
          <button
            className="action-btn"
            onClick={() => {
              navigator.clipboard.writeText(address);
              toast.success(<FormattedMessage id="wallet.clipboard" />);
            }}
          >
            <Tooltip icon={faCopy} placement="top">
              <FormattedMessage id="wallet.clipboardtooltip" />
            </Tooltip>
          </button>
        )}
      </div>

      <button onClick={showTransak} className="action-btn">
        <FormattedMessage id="wallet.top-up" />
      </button>
    </div>
  );
};

export default MyAccountCard;
