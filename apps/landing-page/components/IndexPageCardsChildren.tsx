import {
  faEarthEurope,
  faGraduationCap,
  faRocket,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Waypoint } from 'react-waypoint';
import { IndexCardAnimation } from './animations/IndexCardAnimation';
import IndexCard from './IndexCard';

function IndexPageCardsChildren() {
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-96 z-10">
      <Waypoint onEnter={() => setShow(true)} />
      <div className="mb-8 bg-gradient-pink-text bg-clip-text text-center text-6xl font-bold text-transparent  sm:text-left xl:hidden">
        <FormattedMessage id="childcard.title" />
      </div>
      <div
        className={`relative grid grid-cols-4 gap-8 ${
          show ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <IndexCardAnimation>
          <IndexCard
            title="childcard.liberty.title"
            content="childcard.liberty.content"
            icon={faRocket}
            varitaion
          />
          <IndexCard
            title="childcard.practice.title"
            content="childcard.practice.content"
            icon={faGraduationCap}
            varitaion
          />
          <IndexCard
            title="childcard.discovery.title"
            content="childcard.discovery.content"
            icon={faEarthEurope}
            varitaion
          />
        </IndexCardAnimation>
        <div className="hidden items-center justify-center xl:flex">
          <h2 className="col-span-1 bg-gradient-pink-text bg-clip-text text-6xl font-bold text-transparent">
            <FormattedMessage id="childcard.title" />
          </h2>
        </div>
      </div>
    </div>
  );
}

export default IndexPageCardsChildren;
