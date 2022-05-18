import Header from '../header/Header';
import AuthGuard from './AuthGuard';

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
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="max-w-screen min-h-screen overflow-hidden">
        {!noHeader && <Header />}
        {children}
      </div>
    </AuthGuard>
  );
}

export default MainWrapper;
