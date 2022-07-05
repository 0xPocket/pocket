import React from 'react';
import { FormattedMessage } from 'react-intl';

const Conclusion: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 text-center">
      <h1>
        <FormattedMessage id="conclusion.title" />
      </h1>
      <h3>
        <FormattedMessage id="conclusion.subtitle" />
      </h3>
      <p>
        <FormattedMessage id="conclusion.team" />
      </p>
    </div>
  );
};

export default Conclusion;
