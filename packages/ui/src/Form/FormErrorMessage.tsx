import { animated, useSpring } from "react-spring";

type ErrorMessageProps = {
  message?: string;
  className?: string;
};

export function FormErrorMessage({ message, className }: ErrorMessageProps) {
  const styles = useSpring({ from: { opacity: 0 }, to: { opacity: 1 } });

  return (
    <animated.div style={styles} className={className}>
      <span className="mt-2 text-sm text-danger">{message}</span>
    </animated.div>
  );
}
