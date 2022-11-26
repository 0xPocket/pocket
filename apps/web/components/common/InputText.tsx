import {
  type DetailedHTMLProps,
  type FC,
  type InputHTMLAttributes,
  useId,
} from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

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
        className="w-full rounded-md border  border-white-darker  bg-dark-light px-3 py-2 shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={label}
        required={!optional}
        {...rest}
        {...register}
      />
    </div>
  );
};

export default InputText;
