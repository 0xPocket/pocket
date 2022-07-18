import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '@lib/nest-auth/next';
import { SectionContainer } from '@lib/ui';
import { useRouter } from 'next/router';
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

  if (loading)
    return (
      <SectionContainer>
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
      </SectionContainer>
    );

  return <>{children}</>;
}

export default AuthGuard;
