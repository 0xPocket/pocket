import FormattedMessage from '../common/FormattedMessage';
import React, { useState } from 'react';
import BugDialog from './BugDialog';
import ContactDialog from './ContactDialog';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

function Footer() {
  const [contactOpen, setContactOpen] = useState(false);
  const [bugOpen, setBugOpen] = useState(false);
  const { status } = useSession();

  return (
    <footer className="absolute bottom-0 left-0 right-0 ">
      <div className="mx-auto max-w-7xl overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
        <nav
          className="-mx-5 -my-2 flex flex-wrap justify-center"
          aria-label="Footer"
        >
          <div className="px-5 py-2">
            <Link href="/privacy-policy">
              <a>
                <FormattedMessage id="legal.privacy" />
              </a>
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link href="/terms-and-conditions">
              <a>
                <FormattedMessage id="legal.terms" />
              </a>
            </Link>
          </div>
          <div className="px-5 py-2">
            <a onClick={() => setContactOpen(true)}>Contact</a>
          </div>
          {status === 'authenticated' && (
            <div className="px-5 py-2">
              <a className="text-danger" onClick={() => setBugOpen(true)}>
                <FormattedMessage id="footer.report-bug" />
              </a>
            </div>
          )}
        </nav>
        <p className="mt-8 text-center text-base text-gray">
          &copy; 2022 Pocket.
        </p>
      </div>
      <ContactDialog isOpen={contactOpen} setIsOpen={setContactOpen} />
      <BugDialog isOpen={bugOpen} setIsOpen={setBugOpen} />
    </footer>
  );
}

export default Footer;
