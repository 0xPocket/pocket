import { toast } from 'react-toastify';
import { Button } from '@lib/ui';
import { useAccount, useBalance } from 'wagmi';
import { useSmartContract } from '../../contexts/contract';

type MainTabPanelProps = {};

function MainTabPanel({}: MainTabPanelProps) {
  const { address } = useAccount();
  const { erc20Data } = useSmartContract();
  const { data, isLoading } = useBalance({
    addressOrName: address,
    token: erc20Data?.address,
    formatUnits: erc20Data?.decimals,
    watch: true,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="">My Wallet</h2>
        {address && (
          <Button
            action={() => {
              navigator.clipboard.writeText(address);
              toast.success('Address copied to clipboard !');
            }}
          >
            Copy address
          </Button>
        )}
      </div>
      <div className="border-b pb-4">
        <span>Available funds</span>
        <div>
          {isLoading ? (
            <h2>loading...</h2>
          ) : (
            <div className="flex items-end gap-2">
              <h2>{data?.formatted}</h2>
              <span>{data?.symbol}</span>
            </div>
          )}
        </div>
      </div>
      <Button>Top-Up</Button>
    </div>
  );
}

export default MainTabPanel;
