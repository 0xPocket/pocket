import { toast } from 'react-toastify';
import { FormInputText } from '@lib/ui';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { useZodForm } from '../../utils/useZodForm';
import { trpc } from '../../utils/trpc';

type AddChildFormProps = {};

const AddChildSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

type FormValues = z.infer<typeof AddChildSchema>;

function AddChildForm({}: AddChildFormProps) {
  const router = useRouter();
  const queryClient = trpc.useContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm({
    schema: AddChildSchema,
  });

  const addChild = trpc.useMutation(['parent.createChild'], {
    onSuccess: () => {
      queryClient.invalidateQueries('parent.children');
      router.push('/');
      toast.success(`Account created !`);
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const onSubmit = (data: FormValues) => {
    addChild.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex gap-4">
        <FormInputText
          type="text"
          placeHolder="Name"
          registerValues={register('name')}
          error={errors.name}
        />
      </div>

      <FormInputText
        placeHolder="john@doe.com"
        registerValues={register('email')}
        type="email"
        error={errors.email}
      />

      <input
        type="submit"
        value="Submit"
        disabled={addChild.isLoading}
        className="rounded-md bg-dark  px-4 py-3 text-bright"
      />
    </form>
  );
}

export default AddChildForm;
