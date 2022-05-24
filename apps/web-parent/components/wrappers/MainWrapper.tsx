import Header from '../header/Header';
import DecryptWalletModal from '../wallet/DecryptWalletModal';
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
      <div className="max-w-screen min-h-screen overflow-hidden">
        {!noHeader && <Header />}
        {children}
        <DecryptWalletModal />
      </div>
    );
  }

  return (
    <AuthGuard>
      <WalletGuard>
        <div className="max-w-screen min-h-screen overflow-hidden">
          {!noHeader && <Header />}
          {children}
          <DecryptWalletModal />
        </div>
      </WalletGuard>
    </AuthGuard>
  );
}

export default MainWrapper;
