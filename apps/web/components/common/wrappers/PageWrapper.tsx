import Footer from '../../footer/Footer';
import Header from '../../header/Header';
import BackgoundSplit from '../BackgoundSplit';
import { FC, useState } from 'react';
import { TermsModal } from '../TermsModal';
import { env } from 'config/env/client';
import FormattedMessage from '../FormattedMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

type PageWrapperProps = {
  children: React.ReactNode;
  noHeader?: boolean;
  noFooter?: boolean;
  noContainer?: boolean;
  noTermsModal?: boolean;
};

const PageWrapper: FC<PageWrapperProps> = ({
  children,
  noHeader = false,
  noFooter = false,
  noContainer = false,
  noTermsModal = false,
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-20">
      {open && env.NETWORK_KEY === 'polygon-mumbai' && (
        <div className="relative mt-2 flex items-center justify-between gap-4 rounded-lg bg-primary px-4">
          <p className="flex-grow text-center text-sm font-bold">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            <FormattedMessage id="testnet.disclaimer" />
          </p>
          <div onClick={() => setOpen(false)} className="cursor-pointer">
            X
          </div>
        </div>
      )}
      {!noHeader && <Header />}
      {!noContainer ? (
        <div className="container relative mx-auto my-12">{children}</div>
      ) : (
        children
      )}
      <BackgoundSplit className="-top-80 -left-96" />
      <BackgoundSplit className="-bottom-[50vh] -right-96" />
      {!noFooter && <Footer className="absolute bottom-0 left-0 right-0" />}
      {!noTermsModal && <TermsModal />}
    </div>
  );
};

export default PageWrapper;
