import { animated, useTransition } from "react-spring";

type IndexCardAnimationProps = {
  children: React.ReactNode[];
};

export function IndexCardAnimation({
  children: items,
}: IndexCardAnimationProps) {
  const transitions = useTransition(items, {
    from: {
      opacity: 0,
      marginTop: -100,
    },
    enter: (item, i) => ({
      delay: () => {
        return i * 500;
      },
      opacity: 1,
      marginTop: 0,
    }),
    config: {
      tension: 280,
      friction: 60,
    },
  });

  return transitions((style, item) => (
    <animated.div style={style}>{item}</animated.div>
  ));
}
