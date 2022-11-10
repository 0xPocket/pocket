import { useSession } from 'next-auth/react';
import { FC, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useSignOut } from '../../hooks/useSignOut';

const SwitchAccountModal: FC = () => {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const { isConnected, address } = useAccount();
  const signOut = useSignOut();

  useEffect(() => {
    if (signOut.isLoading || signOut.isSuccess) {
      return;
    }
    if (status === 'authenticated' && !isConnected && signOut.isIdle) {
      signOut.mutate();
    }
    if (
      status === 'authenticated' &&
      isConnected &&
      session?.user.address !== address &&
      signOut.isIdle
    ) {
      signOut.mutate();
    }
    if (open && session?.user.address === address) {
      setOpen(false);
    }
  }, [status, isConnected, session?.user, address, open, signOut]);

  return null;
};

export default SwitchAccountModal;
