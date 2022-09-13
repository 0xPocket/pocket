import React from 'react';
import FormattedMessage from '../common/FormattedMessage';

type FooterProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;

function Footer(props: FooterProps) {
  return (
    <footer {...props}>
      <p className="mt-8 py-2 text-center text-base">
        &copy;
        <FormattedMessage id="footer.rightReserved" />
      </p>
    </footer>
  );
}

export default Footer;
