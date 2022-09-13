import React, { useState } from 'react';
import { useMagic } from '../../contexts/auth';
import BugDialog from './BugDialog';
import ContactDialog from './ContactDialog';

type FooterProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;

function Footer(props: FooterProps) {
  const [contactOpen, setContactOpen] = useState(false);
  const [bugOpen, setBugOpen] = useState(false);
  const { loggedIn } = useMagic();

  return (
    <footer {...props}>
      <div className="flex items-center justify-center gap-4 py-2 text-base">
        <p>&copy; 2022 Pocket</p>
        <a onClick={() => setContactOpen(true)}>Contact</a>
        {loggedIn && (
          <a
            className="text-danger"
            onClick={() => setBugOpen(true)}
          >{`Report a bug`}</a>
        )}
      </div>
      <ContactDialog isOpen={contactOpen} setIsOpen={setContactOpen} />
      <BugDialog isOpen={bugOpen} setIsOpen={setBugOpen} />
    </footer>
  );
}

export default Footer;
