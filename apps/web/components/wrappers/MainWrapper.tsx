import BackgoundSplit from '@lib/ui/src/Background/BackgoundSplit';
import Footer from '../footer/Footer';
import Header from '../header/Header';

type MainWrapperProps = {
  children: React.ReactNode;
  noHeader?: boolean;
  noFooter?: boolean;
};

function MainWrapper({
  children,
  noHeader = false,
  noFooter = false,
}: MainWrapperProps) {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-20">
      {!noHeader && <Header />}
      {children}
      <BackgoundSplit className="-top-80 -left-96" />
      <BackgoundSplit className="-bottom-[50vh] -right-96" />
      {!noFooter && <Footer className="absolute bottom-0 left-0 right-0" />}
    </div>
  );
}

export default MainWrapper;
