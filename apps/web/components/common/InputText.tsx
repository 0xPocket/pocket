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
        className="w-full rounded-md border border-dark border-opacity-10 bg-bright-dark px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white-darker dark:bg-dark-light dark:shadow-lg"
        placeholder={label}
        required={!optional}
        {...rest}
        {...register}
      />
    </div>
  );
};

export default InputText;
