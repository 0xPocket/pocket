import React from 'react';
import { FormattedMessage } from 'react-intl';

type Props = {
  onClick: () => void;
};

const Introduction: React.FC<Props> = ({ onClick }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 text-center">
      <h1>
        <FormattedMessage id="intro.title" />
      </h1>
      <h1>
        <FormattedMessage id="intro.subtitle" />
      </h1>
      <h2 className=" font-normal">
        <FormattedMessage id="intro.thirdtitle" />
      </h2>
      <button
        onClick={onClick}
        className="rounded-lg bg-primary p-4 text-white"
      >
        <FormattedMessage id="intro.letsgo" />
      </button>
    </div>
  );
};

export default Introduction;
