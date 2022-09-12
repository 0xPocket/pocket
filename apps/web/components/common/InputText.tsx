import { DetailedHTMLProps, FC, InputHTMLAttributes, useId } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

type InputTextProps = {
  label: string;
  register: UseFormRegisterReturn;
  optional?: boolean;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const InputText: FC<InputTextProps> = ({
  label,
  register,
  optional = false,
  ...rest
}) => {
  const id = useId();
  return (
    <div className="group relative z-0 flex w-full">
      <input
        type="text"
        id={id}
        className="input-text text-md peer"
        placeholder=" "
        required={!optional}
        {...rest}
        {...register}
      />
      <label
        htmlFor={id}
        className="text-md absolute top-1 -z-10 origin-[0] -translate-y-6 scale-75 transform text-left duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium"
      >
        {label}
      </label>
    </div>
  );
};

export default InputText;
