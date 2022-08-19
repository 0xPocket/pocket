import { FC, useEffect } from 'react';
import { z } from 'zod';
import { useZodForm } from '../../utils/useZodForm';
import { trpc } from '../../utils/trpc';
import { AuthSchema } from '../../server/schemas';
import { Spinner } from '../common/Spinner';

const OnBoardingForm: FC = () => {
  const { data } = trpc.useQuery(['auth.me']);

  const { register, handleSubmit, formState, setValue } = useZodForm({
    mode: 'all',
    reValidateMode: 'onChange',
    schema: AuthSchema.onboard,
  });

  const onboardUser = trpc.useMutation('auth.onboard');

  const onSubmit = async (data: z.infer<typeof AuthSchema.onboard>) => {
    onboardUser.mutateAsync(data).then(() => {
      // router.push('/');
      window.location.href = '/';
    });
  };

  useEffect(() => {
    if (data?.user.email) {
      setValue('email', data?.user.email);
    }
  }, [data, setValue]);

  if (onboardUser.isLoading) {
    return <Spinner />;
  }

  return (
    <form
      className="flex w-full flex-col items-center justify-center gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={`flex w-full flex-col items-center justify-center gap-4`}>
        <label>We need some more infos !</label>
        <input
          {...register('name')}
          className="without-ring container-classic w-full border border-dark-lightest/50 p-2 px-4 font-thin shadow dark:border-white-darker dark:bg-dark"
          autoComplete="name"
          spellCheck="false"
          placeholder="Name"
        />
        <input
          {...register('email')}
          className={`without-ring container-classic w-full border border-dark-lightest/50 p-2 px-4 font-thin shadow dark:border-white-darker dark:bg-dark ${
            !data?.user.email
              ? 'cursor-pointer opacity-100 dark:hover:bg-dark-light'
              : 'cursor-not-allowed opacity-50'
          }`}
          autoComplete="email"
          disabled={!!data?.user.email}
          placeholder="Email"
        />
        <input
          type="submit"
          className={`container-classic flex w-full cursor-pointer justify-center p-2 px-4 font-thin transition-all dark:bg-dark-light/50 ${
            formState.isValid
              ? 'cursor-pointer opacity-100 dark:hover:bg-dark-light'
              : 'cursor-not-allowed opacity-25'
          }`}
          value="Submit"
        />
      </div>
    </form>
  );
};

export default OnBoardingForm;
