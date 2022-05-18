import { Dispatch, MouseEventHandler, SetStateAction } from 'react';

type ButtonProps = {
  children: React.ReactNode;
  action?: () => void;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  isOpen?: boolean;
  light?: boolean;
};

function Button({ children, action, light, setIsOpen, isOpen }: ButtonProps) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (action) action();
    if (setIsOpen) setIsOpen(!isOpen);
  };
  return (
    <button
      onClick={handleClick}
      className={
        light
          ? 'text-primary-dark underline'
          : 'bg-primary-dark text-bright' +
            ' relative flex items-center justify-center overflow-hidden rounded-md px-4 py-3'
      }
    >
      {children}
    </button>
  );
}

export default Button;
