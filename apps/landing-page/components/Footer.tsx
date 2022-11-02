import React from 'react';
import { FormattedMessage } from 'react-intl';

type FooterProps = {};

function Footer({}: FooterProps) {
  return (
    <footer className="w-full bg-dark-lightest px-8 dark:bg-dark-light">
      <div className="container mx-auto flex flex-col justify-evenly sm:flex-row sm:px-0">
        <div className=" py-12">
          <p className="pb-3 text-base text-white">
            <FormattedMessage id="footer.ressources" />
          </p>
          <a
            className="text block text-base text-gray-light"
            href="https://blog.gopocket.co/fr"
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
        <div className="sm:py-12">
          <p className="pb-3 text-base text-white">
            <FormattedMessage id="footer.about" />
          </p>
          <a
            className="block text-base text-gray-light"
            href="https://blog.gopocket.co/fr-posts/FAQ"
          >
            <FormattedMessage id="faq" />
          </a>
        </div>
        <div className="flex items-center py-12 text-white">
          <span className="text-base">
            <FormattedMessage id="footer.copyright" />
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
