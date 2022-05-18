import { useEffect } from 'react';
import { animated, useSpring } from 'react-spring';

type WalletAnimationProps = {
  children: React.ReactNode;
};

function WalletAnimation({ children }: WalletAnimationProps) {
  const [spring, api] = useSpring(() => ({}));
  useEffect(() => {
    api.start({
      from: { opacity: 0, scale: 0 },
      to: { opacity: 1, scale: 1 },
      config: {
        mass: 0.7,
        tension: 251,
        friction: 21,
        velocity: 0.021,
      },
    });
    console.log('ici');
  }, [api]);

  return <animated.div style={spring}>{children}</animated.div>;
}

export default WalletAnimation;
