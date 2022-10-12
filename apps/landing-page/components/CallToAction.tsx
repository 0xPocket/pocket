import Link from 'next/link';
import React from 'react';

const CallToAction: React.FC = () => {
  return (
    <div className="flex items-center  gap-8 pt-8">
      <Link href="https://app.gopocket.co">
        <button className="action-btn  text-xl ">
          Go to app
          <span className="ml-2 text-2xl">🚀</span>
        </button>
      </Link>
    </div>
  );
};

export default CallToAction;
