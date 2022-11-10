import { useSession } from 'next-auth/react';
import { FC, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useSignOut } from '../../hooks/useSignOut';
import { DialogPopupWrapper } from '../common/wrappers/DialogsWrapper';

const SwitchAccountModal: FC = () => {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const { isConnected, address } = useAccount();
  const signOut = useSignOut();

  const handleClose = () => {
    signOut.mutate();
  };

  useEffect(() => {
    if (signOut.isLoading || signOut.isSuccess) {
      return;
    }
    if (status === 'authenticated' && !isConnected) {
      setOpen(true);
    }
    if (
      status === 'authenticated' &&
      isConnected &&
      session?.user.address !== address
    ) {
      setOpen(true);
    }
    if (open && session?.user.address === address) {
      setOpen(false);
    }
  }, [
    status,
    isConnected,
    session?.user,
    address,
    open,
    signOut.isLoading,
    signOut.isSuccess,
  ]);

  return (
    <DialogPopupWrapper isOpen={open} setIsOpen={handleClose}>
      <button onClick={() => signOut.mutate()}>Disconnect</button>
    </DialogPopupWrapper>
  );
};

export default SwitchAccountModal;
