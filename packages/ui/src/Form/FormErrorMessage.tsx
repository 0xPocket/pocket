import { animated, useSpring } from "react-spring";

type ErrorMessageProps = {
  message?: string;
};

export function FormErrorMessage({ message }: ErrorMessageProps) {
  const styles = useSpring({ from: { opacity: 0 }, to: { opacity: 1 } });

  return (
    <animated.div style={styles}>
      <span className="mt-2 text-sm text-danger">{message}</span>
    </animated.div>
  );
}
