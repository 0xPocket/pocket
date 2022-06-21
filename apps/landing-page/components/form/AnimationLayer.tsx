import { useTransition, animated } from 'react-spring';

type AnimationLayerProps = {
  show: boolean;
  children: React.ReactNode;
  step?: number;
  questionsLength: number;
};

function AnimationLayer({
  show,
  children,
  step,
  questionsLength,
}: AnimationLayerProps) {
  const transitions = useTransition(show, {
    from: { opacity: 0, translateY: -1000 },
    enter: { opacity: 1, translateY: 0 },
    leave: { opacity: 0, translateY: 1500 },
    config: {
      mass: 2.5,
      tension: 119,
      friction: 22,
    },
    delay: 200,
  });

  return transitions(
    (styles, item) =>
      item && (
        <animated.div
          style={styles}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="flex flex-col items-end justify-center gap-8">
            {step && step >= 0 && (
              <div>
                {step}/{questionsLength}
              </div>
            )}
            {children}
          </div>
        </animated.div>
      ),
  );
}

export default AnimationLayer;
