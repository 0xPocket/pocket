import {
  faEarthEurope,
  faGraduationCap,
  faRocket,
} from '@fortawesome/free-solid-svg-icons';
import { IndexCardAnimation } from '@lib/ui';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Waypoint } from 'react-waypoint';
import IndexCard from './IndexCard';

function IndexPageCardsChildren() {
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-96 z-10">
      <Waypoint onEnter={() => setShow(true)} />
      <div className="mb-8 bg-gradient-pink-text bg-clip-text text-center text-6xl font-bold text-transparent  sm:text-left xl:hidden">
        <FormattedMessage id="childcard.title" />
      </div>
      <div className="relative grid grid-cols-4 gap-8">
        {show && (
          <IndexCardAnimation>
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
            <IndexCard
              title="childcard.liberty.title"
              content="childcard.liberty.content"
              icon={faRocket}
              varitaion
            />
          </IndexCardAnimation>
        )}
        <div className="col-span-1 hidden items-center justify-center bg-gradient-pink-text bg-clip-text text-6xl  font-bold text-transparent xl:col-span-1 xl:flex xl:aspect-square 2xl:aspect-[2/1.5]">
          <FormattedMessage id="childcard.title" />
        </div>
      </div>
    </div>
  );
}

export default IndexPageCardsChildren;
