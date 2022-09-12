import React from 'react';

type FooterProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;

function Footer(props: FooterProps) {
  return (
    <footer {...props}>
      <p className="mt-8 py-2 text-center text-base">
        &copy; 2022 Pocket. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
