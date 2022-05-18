import { useState } from 'react';
import { animated, useTransition } from 'react-spring';
import { Waypoint } from 'react-waypoint';
import IndexCard from '../cards/IndexCard';

const items = [
  {
    title: 'Decentralised pocket money',
    content: 'Easy to set-up, highly customizable',
    link: '#decentralised-pocket-money',
  },
  {
    title: 'Activity monitoring',
    content: 'Stay in touch over its types of expenses',
    link: '#activity-monitoring',
  },
  {
    title: 'A place to learn',
    content: 'Be sure he discover safe and best projects',
    link: '#a-place-to-learn',
  },
];

function IndexPageCards() {
  const [transitionItems, setTransitionItems] = useState<typeof items>([]);

  const transitions = useTransition(transitionItems, {
    from: {
      opacity: 0,
      marginTop: -300,
    },
    enter: (item, i) => ({
      delay: () => {
        return i * 500;
      },
      opacity: 1,
      marginTop: -200,
    }),
    config: {
      tension: 280,
      friction: 60,
    },
  });

  return (
    <div className="z-10 h-96">
      <Waypoint onEnter={() => setTransitionItems(items)} />
      <div className="relative flex w-screen justify-evenly ">
        {transitions((style, item) => (
          <animated.div style={style} className="">
            <IndexCard
              title={item.title}
              content={item.content}
              href={item.link}
            />
          </animated.div>
        ))}
      </div>
    </div>
  );
}

export default IndexPageCards;
