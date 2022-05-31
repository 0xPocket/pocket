import { IndexArgumentsAnimation } from '@lib/ui';
import { useState } from 'react';
import { Element } from 'react-scroll';
import { Waypoint } from 'react-waypoint';

type ArgumentContainerProps = {
  title: string;
  children: React.ReactNode[];
  direction: 'left' | 'right';
  name: string;
};

function ArgumentContainer({
  title,
  children,
  direction,
  name,
}: ArgumentContainerProps) {
  const [show, setShow] = useState(false);

  return (
    <Element
      name={name}
      className={`min-h-screen py-16 ${
        direction === 'left' ? 'text-left' : 'text-right'
      }`}
    >
      <Waypoint onEnter={() => setShow(true)} />
      <h2 className="z-10 mb-4 inline-block bg-gradient-blue-text bg-clip-text pb-4 text-5xl text-transparent">
        {title}
      </h2>
      {show && (
        <IndexArgumentsAnimation direction={direction}>
          {children}
        </IndexArgumentsAnimation>
      )}
    </Element>
  );
}

export default ArgumentContainer;
