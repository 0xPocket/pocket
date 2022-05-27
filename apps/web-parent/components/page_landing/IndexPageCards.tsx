import { IndexCardAnimation } from '@lib/ui';
import { useState } from 'react';
import { Waypoint } from 'react-waypoint';
import IndexCard from '../cards/IndexCard';

function IndexPageCards() {
  const [show, setShow] = useState(false);

  return (
    <div className="z-10 h-96">
      <Waypoint onEnter={() => setShow(true)} />
      <div className="relative flex w-screen justify-evenly ">
        {show && (
          <IndexCardAnimation>
            <IndexCard
              title="Decentralised pocket money"
              content="Easy to set-up, highly customizable"
              href="#decentralised-pocket-money"
            />
            <IndexCard
              title="Activity monitoring"
              content="Stay in touch over its types of expenses"
              href="#activity-monitoring"
            />
            <IndexCard
              title="A place to learn"
              content="Be sure he discover safe and best projects"
              href="#a-place-to-learn"
            />
          </IndexCardAnimation>
        )}
      </div>
    </div>
  );
}

export default IndexPageCards;
