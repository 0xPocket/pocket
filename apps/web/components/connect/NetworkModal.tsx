import { env } from 'config/env/client';
import { FC, useEffect, useState } from 'react';
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { Spinner } from '../common/Spinner';
import { DialogPopupWrapper } from '../common/wrappers/DialogsWrapper';

const NetworkModal: FC = () => {
  const [open, setIsOpen] = useState(false);
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork, isLoading } = useSwitchNetwork({
    chainId: env.CHAIN_ID,
  });
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isConnected && switchNetwork && chain?.id !== env.CHAIN_ID) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [chain, switchNetwork, isConnected]);

  const handleClose = () => {
    disconnect();
  };

  return (
    <DialogPopupWrapper isOpen={open} setIsOpen={handleClose}>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <button className="action-btn" onClick={() => switchNetwork!()}>
            Switch network
          </button>
          <button className="third-btn py-0" onClick={() => disconnect()}>
            go back
          </button>
        </>
      )}
    </DialogPopupWrapper>
  );
};

export default NetworkModal;
