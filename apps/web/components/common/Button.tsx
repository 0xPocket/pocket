import { MouseEventHandler } from 'react';

type ButtonProps = {
  children: React.ReactNode;
  action?: (data: any) => void;
  arg?: any;
  light?: Boolean;
};

function Button({ children, action, light, arg }: ButtonProps) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault;
    if (action) action(arg);
  };
  return (
    <button
      onClick={handleClick}
      className={
        light
          ? 'underline'
          : 'bg-dark text-bright' +
            ' relative flex items-center justify-center overflow-hidden rounded-md px-4 py-3'
      }
    >
      {children}
    </button>
  );
}

export default Button;
