import Header from '../header/Header';
import AuthGuard from './AuthGuard';
import WalletGuard from './WalletGuard';

type MainWrapperProps = {
  children: React.ReactNode;
  noHeader?: boolean;
  authProtected?: boolean;
};

function MainWrapper({
  children,
  noHeader = false,
  authProtected = false,
}: MainWrapperProps) {
  if (!authProtected) {
    return (
      <div className="min-h-screen">
        {!noHeader && <Header />}
        {children}
      </div>
    );
  }

  return (
    <AuthGuard>
      <WalletGuard>
        <div className="min-h-screen">
          {!noHeader && <Header />}
          {children}
        </div>
      </WalletGuard>
    </AuthGuard>
  );
}

export default MainWrapper;
