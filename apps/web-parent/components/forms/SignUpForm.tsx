import { FormInputText } from '@lib/ui';
import { useForm } from 'react-hook-form';

type SignUpFormProps = {};

type SignUpDataForm = {
  email: string;
  password: string;
};
function SignUpForm({}: SignUpFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpDataForm>();

  const onSubmit = (data: SignUpDataForm) => console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-72 flex-col gap-4"
    >
      <FormInputText
        placeHolder="john@doe.com"
        registerValues={register('email', {
          required: 'This field is required',
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: 'Entered value does not match email format',
          },
        })}
        type="email"
        error={errors.email}
      />

      {/* (?=.*\d)          // should contain at least one digit
			(?=.*[a-z])       // should contain at least one lower case
			(?=.*[A-Z])       // should contain at least one upper case
			[a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters */}
      <FormInputText
        placeHolder="password"
        registerValues={register('password', {
          required: 'This field is required',
          // pattern: {
          //   value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
          //   message:
          //     'Password should at least contain one digit, one lower case, one upper case and be 8+ characters long.',
          // },
        })}
        type="password"
        error={errors.password}
      />

      <input
        type="submit"
        value="Submit"
        className="rounded-md bg-dark  px-4 py-3 text-bright"
      />
    </form>
  );
}

export default SignUpForm;
