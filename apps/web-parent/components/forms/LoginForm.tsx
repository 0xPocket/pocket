import { useAuth } from '@lib/nest-auth/next';
import { FormErrorMessage } from '@lib/ui';
import { useForm } from 'react-hook-form';

type LoginFormProps = {};

type LoginDataForm = {
  email: string;
  password: string;
};

function LoginForm({}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDataForm>();
  const { signIn } = useAuth();

  const onSubmit = (data: LoginDataForm) => {
    signIn('local', data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-72 flex-col gap-4"
    >
      <div className="flex flex-col">
        <input
          className="w-full rounded-md border border-gray-light px-5 py-3 placeholder-gray focus:border-primary-dark focus:ring-primary-dark dark:text-gray sm:max-w-xs"
          placeholder="john@doe.com"
          {...register('email', {
            required: 'This field is required',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Entered value does not match email format',
            },
          })}
          type="email"
        />
        {errors.email && <FormErrorMessage message={errors.email.message} />}
      </div>

      {/* (?=.*\d)          // should contain at least one digit
			(?=.*[a-z])       // should contain at least one lower case
			(?=.*[A-Z])       // should contain at least one upper case
			[a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters */}
      <div className="flex flex-col">
        <input
          className="w-full rounded-md border border-gray-light px-5 py-3 placeholder-gray focus:border-primary-dark focus:ring-primary-dark dark:text-gray sm:max-w-xs"
          placeholder="password"
          {...register('password', {
            required: 'This field is required',
            // pattern: {
            //   value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
            //   message:
            //     'Password should at least contain one digit, one lower case, one upper case and be 8+ characters long.',
            // },
          })}
          type="password"
        />
        {errors.password && (
          <FormErrorMessage message={errors.password.message} />
        )}
      </div>

      <input
        type="submit"
        value="Submit"
        className="rounded-md bg-dark  px-4 py-3 text-bright"
      />
    </form>
  );
}

export default LoginForm;
