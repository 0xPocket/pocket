import Footer from '../../footer/Footer';
import Header from '../../header/Header';
import BackgoundSplit from '../BackgoundSplit';
import type { FC } from 'react';

type MainWrapperProps = {
  children: React.ReactNode;
  noHeader?: boolean;
  noFooter?: boolean;
  noContainer?: boolean;
};

const MainWrapper: FC<MainWrapperProps> = ({
  children,
  noHeader = false,
  noFooter = false,
  noContainer = false,
}) => {
  if (noContainer)
    return (
      <div className="relative min-h-screen overflow-hidden px-4 pb-20">
        {!noHeader && <Header />}
        {children}
        <BackgoundSplit className="-top-80 -left-96" />
        <BackgoundSplit className="-bottom-[50vh] -right-96" />
        {!noFooter && <Footer className="absolute bottom-0 left-0 right-0" />}
      </div>
    );

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-20">
      {!noHeader && <Header />}
      <div className="container relative mx-auto my-12">{children}</div>
      <BackgoundSplit className="-top-80 -left-96" />
      <BackgoundSplit className="-bottom-[50vh] -right-96" />
      {!noFooter && <Footer className="absolute bottom-0 left-0 right-0" />}
    </div>
  );
};

export default MainWrapper;