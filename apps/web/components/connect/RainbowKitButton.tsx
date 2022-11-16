import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useDisconnect } from 'wagmi';
import { Spinner } from '../common/Spinner';

const RainbowKitButton = ({ callback }: { callback?: () => void }) => {
  const { disconnect } = useDisconnect();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div>
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="flex h-10 items-center rounded-xl bg-primary p-4 font-sans font-bold transition-all hover:scale-[1.025]"
                  >
                    Connect Wallet
                  </button>
                );
              }
              if (!callback) {
                return <Spinner />;
              }
              return (
                <div className="space-y-4">
                  <h3>Connected with {account.displayName}</h3>
                  <div className="flex justify-center gap-4">
                    <button onClick={() => disconnect()} className="third-btn">
                      disconnect
                    </button>
                    <button onClick={() => callback()} className="action-btn">
                      Continue
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default RainbowKitButton;
