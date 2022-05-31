import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useWallet } from '../../contexts/wallet';

type WalletGuardProps = {
  children: React.ReactNode;
};

function WalletGuard({ children }: WalletGuardProps) {
  const router = useRouter();
  const { wallet } = useWallet();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wallet?.publicKey) {
      router.push('/create-wallet');
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [router, wallet]);

  if (loading) return <h1>Loading</h1>;

  return <>{children}</>;
}

export default WalletGuard;
