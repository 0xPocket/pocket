import React from 'react';
import { FormattedMessage } from 'react-intl';

type FooterProps = {};

function Footer({}: FooterProps) {
  return (
    <footer className="text-gray">
      <div className="mx-auto max-w-7xl overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
        <p className="mt-8 text-center text-base">
          <FormattedMessage id="footer.copyright" />
        </p>
        <p className="text-center text-base">
          <FormattedMessage id="footer.contact" />
        </p>
      </div>
    </footer>
  );
}

export default Footer;
