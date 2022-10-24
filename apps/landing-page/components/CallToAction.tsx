import Link from 'next/link';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const CallToAction: React.FC = () => {
  return (
    <div className="flex items-center  gap-8 pt-8">
      <Link href="https://app.gopocket.co/register">
        <button className="action-btn  text-xl ">
          <FormattedMessage id="calltoaction.action" />
          <span className="ml-2 text-2xl">🚀</span>
        </button>
      </Link>
    </div>
  );
};

export default CallToAction;
