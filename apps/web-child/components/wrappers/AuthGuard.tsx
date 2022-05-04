import { useRouter } from 'next/router';

type AuthGuardProps = {
  children: React.ReactNode;
};

function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  return <>{children}</>;
}

export default AuthGuard;
