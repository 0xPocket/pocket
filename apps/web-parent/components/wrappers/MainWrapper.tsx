import BackgoundSplit from '@lib/ui/src/Background/BackgoundSplit';
import Header from '../header/Header';

type MainWrapperProps = {
  children: React.ReactNode;
  noHeader?: boolean;
};

function MainWrapper({ children, noHeader = false }: MainWrapperProps) {
  return (
    <div className="relative min-h-screen overflow-hidden px-4">
      {!noHeader && <Header />}
      {children}
      <BackgoundSplit className="-top-80 -left-96" />
      <BackgoundSplit className="-bottom-[50vh] -right-96" />
    </div>
  );
}

export default MainWrapper;
