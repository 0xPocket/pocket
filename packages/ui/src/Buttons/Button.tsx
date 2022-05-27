import { Dispatch, MouseEventHandler, SetStateAction } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePen } from "@fortawesome/free-solid-svg-icons";

type ButtonProps = {
  children: React.ReactNode;
  action?: () => void;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  isOpen?: boolean;
  light?: boolean;
  className?: string;
  web3action?: boolean;
};

export function Button({
  children,
  action,
  light,
  setIsOpen,
  isOpen,
  className,
  web3action,
}: ButtonProps) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (action) action();
    if (setIsOpen) setIsOpen(!isOpen);
  };
  return (
    <button
      onClick={handleClick}
      className={`${className}
        ${
          light
            ? "text-primary-dark underline underline-offset-2 dark:text-primary-dark"
            : " bg-primary text-bright dark:bg-primary-dark"
        }
             relative flex items-center justify-center overflow-hidden rounded-md px-4 py-3`}
    >
      {children}
      {web3action && <FontAwesomeIcon className="ml-2" icon={faFilePen} />}
    </button>
  );
}
