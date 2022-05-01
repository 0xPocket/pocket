import { Dispatch, MouseEventHandler, SetStateAction } from 'react';

type ButtonProps = {
  children: React.ReactNode;
  action?: (data: any) => void;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  isOpen?: boolean;
  arg?: any;
  light?: Boolean;
};

function Button({
  children,
  action,
  light,
  arg,
  setIsOpen,
  isOpen,
}: ButtonProps) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault;
    if (action) action(arg);
    if (setIsOpen) setIsOpen(!isOpen);
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
