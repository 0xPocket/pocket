import { useAuth } from '@lib/nest-auth/next';
import { Router, useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type AuthGuardProps = {
  children: React.ReactNode;
};

function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { status } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      setLoading(false);
    }
  }, [router, status]);

  if (loading) return <h1>Loading</h1>;

  return <>{children}</>;
}

export default AuthGuard;
