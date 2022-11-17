import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useDisconnect } from 'wagmi';
import FormattedMessage from '../common/FormattedMessage';
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
          <>
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="action-btn"
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
                  <h3>
                    <FormattedMessage
                      id="register.step1.connectedwith"
                      values={{ address: account.displayName }}
                    />
                  </h3>
                  <div className="flex justify-center gap-4">
                    <button onClick={() => disconnect()} className="third-btn">
                      <FormattedMessage id="disconnect" />
                    </button>
                    <button onClick={() => callback()} className="action-btn">
                      <FormattedMessage id="continue" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default RainbowKitButton;
