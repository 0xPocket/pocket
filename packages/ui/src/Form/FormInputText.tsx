import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { FormErrorMessage } from "./FormErrorMessage";

type FormInputTextProps = {
  type: "password" | "email" | "text";
  placeHolder: string;
  registerValues: UseFormRegisterReturn;
  error?: FieldError | undefined;
};

/**
 * This component is intented to be use with react-hook-form
 */
export function FormInputText({
  type,
  placeHolder,
  registerValues,
  error,
}: FormInputTextProps) {
  return (
    <div className="flex flex-col">
      <input
        className="w-full rounded-md border border-gray-light px-5 py-3 placeholder-gray focus:border-primary-dark focus:ring-primary-dark dark:text-gray sm:max-w-xs"
        placeholder={placeHolder}
        type={type}
        {...registerValues}
      />
      {error && <FormErrorMessage message={error.message} />}
    </div>
  );
}
