import { env } from 'config/env/client';
import { FC, useEffect, useState } from 'react';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { useSignOut } from '../../hooks/useSignOut';
import FormattedMessage from '../common/FormattedMessage';
import { Spinner } from '../common/Spinner';
import { DialogPopupWrapper } from '../common/wrappers/DialogsWrapper';

const NetworkModal: FC = () => {
  const [open, setIsOpen] = useState(false);
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork, isLoading } = useSwitchNetwork({
    chainId: env.CHAIN_ID,
  });
  const signOut = useSignOut();

  useEffect(() => {
    if (isConnected && switchNetwork && chain?.id !== env.CHAIN_ID) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [chain, switchNetwork, isConnected]);

  const handleClose = () => {
    signOut.mutate();
  };

  return (
    <DialogPopupWrapper isOpen={open} setIsOpen={handleClose}>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex max-w-md flex-col gap-4">
          <p className="text-center text-xl font-bold">
            <FormattedMessage id="you_must_switch_network" />
          </p>
          <button
            className="action-btn mx-auto w-48"
            onClick={() => switchNetwork!()}
          >
            <FormattedMessage id="switch_network" />
          </button>
          <button className="third-btn py-0" onClick={() => handleClose()}>
            <FormattedMessage id="disconnect" />
          </button>
        </div>
      )}
    </DialogPopupWrapper>
  );
};

export default NetworkModal;
