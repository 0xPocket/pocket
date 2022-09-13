import { toast } from 'react-toastify';
import { useAccount, useBalance } from 'wagmi';
import { useSmartContract } from '../../contexts/contract';
import useRamp from '../../hooks/useRamp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';

type MainTabPanelProps = {};

function MainTabPanel({}: MainTabPanelProps) {
  const { address } = useAccount();
  const { erc20 } = useSmartContract();
  const { showRamp } = useRamp();
  const { data, isLoading } = useBalance({
    addressOrName: address,
    token: erc20.data?.address,
    formatUnits: erc20.data?.decimals,
    enabled: !!erc20.data,
    watch: true,
  });

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">My Wallet</h2>
        {address && (
          <button
            className="action-btn"
            onClick={() => {
              navigator.clipboard.writeText(address);
              toast.success('Address copied to clipboard !');
            }}
          >
            <FontAwesomeIcon icon={faClipboard} />
          </button>
        )}
      </div>
      <div className="flex flex-col">
        <span>Available funds</span>
        {isLoading ? (
          <h2>loading...</h2>
        ) : (
          <div className="flex items-end gap-2">
            <h2>{data?.formatted}</h2>
            <span>{data?.symbol}</span>
          </div>
        )}
      </div>
      <button onClick={showRamp} className="action-btn">
        Top-Up
      </button>
    </div>
  );
}

export default MainTabPanel;
