type AuthGuardProps = {
  children: React.ReactNode;
};

function AuthGuard({ children }: AuthGuardProps) {
  return <>{children}</>;
}

export default AuthGuard;
