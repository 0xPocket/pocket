import { Tab } from '@headlessui/react';
import { animated, useTransition } from 'react-spring';

type TabAnimationProps = {
  children: React.ReactNode[];
};

function TabAnimation({ children }: TabAnimationProps) {
  const transitions = useTransition(children, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    config: {},
  });

  return transitions((style, item, t, i) => (
    <Tab.Panel as={animated.div} style={style} key={i} className="h-full">
      <div className="flex h-full flex-col items-end justify-between">
        {item}
      </div>
    </Tab.Panel>
  ));
}

export default TabAnimation;
