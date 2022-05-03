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
      <div className="flex gap-4">
        <div className="flex flex-col">
          <input
            className="border p-2"
            placeholder="Firstname"
            {...register('firstname', {
              required: 'This field is required',
            })}
            type="text"
          />
          {errors.firstname && (
            <span className="text-sm text-danger">
              {errors.firstname.message}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <input
            className="border p-2"
            placeholder="Lastname"
            {...register('lastname', {
              required: 'This field is required',
            })}
            type="text"
          />
          {errors.lastname && (
            <span className="text-sm text-danger">
              {errors.lastname.message}
            </span>
          )}
        </div>
      </div>

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
      <input
        type="submit"
        value="Submit"
        className="rounded-md bg-dark  px-4 py-3 text-bright"
      />
    </form>
  );
}

export default NewAccountForm;
