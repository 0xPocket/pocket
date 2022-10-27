import React from 'react';
import { FormattedMessage } from 'react-intl';

type FooterProps = {};

function Footer({}: FooterProps) {
  return (
    <footer className="flex w-full justify-around bg-dark-lightest dark:bg-dark-light ">
      <div className="m-auto max-w-7xl py-12 px-4 text-gray-light sm:px-6 lg:px-8">
        <span className="text-base">
          <FormattedMessage id="footer.copyright" />
        </span>
      </div>
      <div className="mx-auto mt-0 inline-block max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
        <p className="pb-3 text-base text-white">
          <FormattedMessage id="footer.ressources" />
        </p>
        <a
          className="text block text-base text-gray-light"
          href="https://blog.gopocket.co"
        >
          <FormattedMessage id="footer.blog" />
        </a>
        <a
          className="inline text-left text-base text-gray-light"
          href="mailto:hello@gopocket.fr"
        >
          <FormattedMessage id="footer.contact" />
        </a>
      </div>
      <div className="mx-auto mt-0 inline-block max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
        <p className="pb-3 text-base text-white">
          <FormattedMessage id="footer.about" />
        </p>
        <a
          className="block text-base text-gray-light"
          href="https://blog.gopocket.co/posts/FAQ"
        >
          <FormattedMessage id="footer.faq" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
