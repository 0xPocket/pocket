import { useAuth } from '@lib/nest-auth/next';
import { UserParent } from '@lib/types/interfaces';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type WalletGuardProps = {
  children: React.ReactNode;
};

function WalletGuard({ children }: WalletGuardProps) {
  const router = useRouter();
  const { user } = useAuth<UserParent>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !user.wallet) {
      router.push('/create-wallet');
    } else {
      setLoading(false);
    }
  }, [router, user]);

  if (loading) return <h1>Loading</h1>;

  return <>{children}</>;
}

export default WalletGuard;
