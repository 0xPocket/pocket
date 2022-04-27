type ButtonProps = {
  children: React.ReactNode;
  action?: (data: any) => void;
  light?: Boolean;
};

function Button({ children, action, light }: ButtonProps) {
  return (
    <button
      onClick={action ? action : undefined}
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
