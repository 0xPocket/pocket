import { animated, useTransition } from "react-spring";

type IndexArgumentsAnimationProps = {
  children: React.ReactNode[];
  direction: "left" | "right";
};

export function IndexArgumentsAnimation({
  children: items,
  direction,
}: IndexArgumentsAnimationProps) {
  const fromLeft = {
    from: { opacity: 0, marginLeft: -200 },
    enter: (item: React.ReactNode, i: number) => ({
      delay: () => {
        return i * 500;
      },
      opacity: 1,
      marginLeft: 0,
    }),
  };

  const fromRight = {
    from: { opacity: 0, marginRight: -200 },
    enter: (item: React.ReactNode, i: number) => ({
      delay: () => {
        return i * 500;
      },
      opacity: 1,
      marginRight: 0,
    }),
  };

  const animConf = direction === "left" ? fromLeft : fromRight;

  const transitions = useTransition(items, {
    ...animConf,
    config: {
      tension: 280,
      friction: 60,
    },
  });

  return transitions((style, item) => (
    <animated.div style={style}>{item}</animated.div>
  ));
}
