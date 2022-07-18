import BackgoundSplit from '@lib/ui/src/Background/BackgoundSplit';
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
      <div className="relative min-h-screen overflow-hidden px-4">
        {!noHeader && <Header />}
        {children}
        <BackgoundSplit className="-top-80 -left-96" />
        <BackgoundSplit className="-bottom-[50vh] -right-96" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4">
      {!noHeader && <Header />}
      <AuthGuard>{children}</AuthGuard>
      <BackgoundSplit className="-top-80 -left-96" />
      <BackgoundSplit className="-bottom-[50vh] -right-96" />
    </div>
  );
}

export default MainWrapper;
