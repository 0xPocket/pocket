import {
  faEuroSign,
  faGear,
  faMessage,
} from '@fortawesome/free-solid-svg-icons';
import { IndexCardAnimation } from '@lib/ui';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Waypoint } from 'react-waypoint';
import IndexCard from './IndexCard';

function IndexPageCardsParents() {
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-96  z-10">
      <Waypoint onEnter={() => setShow(true)} />
      <div className="mb-8 bg-gradient-blue-text bg-clip-text text-center text-6xl font-bold text-transparent  sm:text-left xl:hidden">
        <FormattedMessage id="parentcard.title" />
      </div>
      <div className="relative grid grid-cols-4 gap-8">
        <div className="hidden items-center justify-center xl:flex">
          <h2 className="col-span-1 bg-gradient-blue-text bg-clip-text text-6xl font-bold text-transparent">
            <FormattedMessage id="parentcard.title" />
          </h2>
        </div>
        {show && (
          <IndexCardAnimation>
            <IndexCard
              title="parentcard.simplicity.title"
              content="parentcard.simplicity.content"
              icon={faGear}
            />
            <IndexCard
              title="parentcard.serenity.title"
              content="parentcard.serenity.content"
              icon={faMessage}
            />
            <IndexCard
              title="parentcard.stability.title"
              content="parentcard.stability.content"
              icon={faEuroSign}
            />
          </IndexCardAnimation>
        )}
      </div>
    </div>
  );
}

export default IndexPageCardsParents;
