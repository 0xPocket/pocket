import React from 'react';
import { FormattedMessage } from 'react-intl';

type FooterProps = {};

function Footer({}: FooterProps) {
  return (
    <footer className="flex w-screen justify-around rounded-lg bg-dark-lightest text-white dark:bg-dark-light dark:text-gray">
      <div className="mx-auto mt-0 inline-block max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
        <a
          className="inline-block  text-center text-base"
          href="https://blog.gopocket.co"
        >
          <FormattedMessage id="footer.blog" />
        </a>
      </div>
      <div className="mx-auto inline-block max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
        <span className="block text-left text-base">
          <FormattedMessage id="footer.copyright" />
        </span>
        <span className="text-center text-base ">
          <FormattedMessage id="footer.contact" />
        </span>
      </div>
    </footer>
  );
}

export default Footer;
