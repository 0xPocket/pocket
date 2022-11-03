import Link from 'next/link';
import React, { ReactElement } from 'react';

type CallToActionProps = {
  url: string;
  msg: ReactElement;
  icon?: string;
  className?: string;
};

const CallToAction: React.FC<CallToActionProps> = ({
  url,
  msg,
  icon,
  className,
}) => {
  return (
    <div
      className={`${className} flex items-center justify-center gap-8 md:justify-start`}
    >
      <Link href={url}>
        <a className="action-btn">
          {msg}
          {icon && <span className="ml-2 text-xl">{icon}</span>}
        </a>
      </Link>
    </div>
  );
};

export default CallToAction;
