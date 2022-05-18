import { useState } from 'react';
import { animated, useTransition } from 'react-spring';
import { Waypoint } from 'react-waypoint';
import IndexCard from '../cards/IndexCard';

function IndexPageCards() {
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

  const [appear, setAppear] = useState<boolean>(false);

  const transitions = useTransition(items, {
    from: {
      opacity: 0,
      top: -100,
    },
    enter: (item, i) => ({
      delay: () => {
        return i * 500;
      },
      opacity: 1,
      top: -0,
    }),
    config: {
      tension: 280,
      friction: 60,
    },
  });

  return (
    <div className="z-10 mb-[100px] mt-[-200px] h-96">
      <Waypoint onEnter={() => setAppear(true)} />
      <div className="flex w-screen justify-evenly ">
        {transitions(
          (style, item) =>
            appear && (
              <div className="relative">
                <animated.div
                  style={style}
                  className="absolute -translate-x-1/2"
                >
                  <IndexCard
                    title={item.title}
                    content={item.content}
                    href={item.link}
                  />
                </animated.div>
              </div>
            ),
        )}
      </div>
    </div>
  );
}

export default IndexPageCards;
