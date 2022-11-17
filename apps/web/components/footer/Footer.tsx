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
    <footer className="absolute bottom-0 left-0 right-0 m-4 grid grid-cols-2 space-y-4 md:flex md:flex-col ">
      <div className="flex items-center justify-center">
        <p>&copy; 2022 Pocket</p>
      </div>
      <div className="flex w-full flex-col gap-4 text-right md:flex-row md:items-center md:justify-center">
        <Link href="/privacy-policy">
          <a>
            <FormattedMessage id="legal.privacy" />
          </a>
        </Link>
        <Link href="/terms-and-conditions">
          <a>
            <FormattedMessage id="legal.terms" />
          </a>
        </Link>
        <a onClick={() => setContactOpen(true)}>Contact</a>
        {status === 'authenticated' && (
          <a className="text-danger" onClick={() => setBugOpen(true)}>
            <FormattedMessage id="footer.report-bug" />
          </a>
        )}
      </div>
      <ContactDialog isOpen={contactOpen} setIsOpen={setContactOpen} />
      <BugDialog isOpen={bugOpen} setIsOpen={setBugOpen} />
    </footer>
  );
}

export default Footer;
