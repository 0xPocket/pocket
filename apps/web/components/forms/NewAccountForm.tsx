import { useForm } from 'react-hook-form';

type NewAccountFormProps = {};

function NewAccountForm({}: NewAccountFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-72 flex-col gap-4"
    >
      <div className="flex flex-col">
        <input
          className="border p-2"
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
        {errors.email && (
          <span className="text-sm text-danger">{errors.email.message}</span>
        )}
      </div>

      {/* (?=.*\d)          // should contain at least one digit
	(?=.*[a-z])       // should contain at least one lower case
	(?=.*[A-Z])       // should contain at least one upper case
	[a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters */}
      <div className="flex flex-col">
        <input
          className="border p-2"
          placeholder="password"
          {...register('password', {
            required: 'This field is required',
            pattern: {
              value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
              message:
                'Password should at least contain one digit, one lower case, one upper case and be 8+ characters long.',
            },
          })}
          type="password"
        />
        {errors.password && (
          <span className="text-sm text-danger">{errors.password.message}</span>
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

export default NewAccountForm;
