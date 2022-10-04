import FormattedMessage from '../common/FormattedMessage';
import React, { useState } from 'react';
import { useAuth } from '../../contexts/auth';
import BugDialog from './BugDialog';
import ContactDialog from './ContactDialog';
import Link from 'next/link';

type FooterProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;

function Footer(props: FooterProps) {
  const [contactOpen, setContactOpen] = useState(false);
  const [bugOpen, setBugOpen] = useState(false);
  const { loggedIn } = useAuth();

  return (
    <footer {...props}>
      <div className="flex items-center justify-center gap-4 py-2 text-base">
        <p>&copy; 2022 Pocket</p>
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
        {loggedIn && (
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
