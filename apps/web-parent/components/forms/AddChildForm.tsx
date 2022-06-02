import { useForm } from 'react-hook-form';
import { FormInputText } from '@lib/ui';

type AddChildFormProps = {};

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  publicKey: string;
};

function AddChildForm({}: AddChildFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log(data);

    //push partial child to db
    //db side: push email to child
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex gap-4">
        <FormInputText
          type="text"
          placeHolder="Firstname"
          registerValues={register('firstName', {
            required: 'This field is required',
          })}
          error={errors.firstName}
        />
        <FormInputText
          placeHolder="Lastname"
          registerValues={register('lastName', {
            required: 'This field is required',
          })}
          type="text"
          error={errors.lastName}
        />
      </div>

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

      {/* <FormInputText
        placeHolder="Public Key"
        registerValues={register('publicKey', {
          required: 'This field is required',
        })}
        type="text"
        error={errors.publicKey}
      /> */}

      <input
        type="submit"
        value="Submit"
        className="rounded-md bg-dark  px-4 py-3 text-bright"
      />
    </form>
  );
}

export default AddChildForm;
