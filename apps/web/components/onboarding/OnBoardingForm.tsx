import { FC, useEffect } from 'react';
import { useZodForm } from '../../utils/useZodForm';
import { trpc } from '../../utils/trpc';
import { AuthSchema } from '../../server/schemas';
import { Spinner } from '../common/Spinner';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useMagic } from '../../contexts/auth';

const OnBoardingForm: FC = () => {
  const { user } = useMagic();
  const utils = trpc.useContext();
  const router = useRouter();

  const { register, handleSubmit, formState, setValue } = useZodForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    schema: AuthSchema['onboard'],
  });

  const onboardUser = trpc.useMutation('auth.onboard', {
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: async (data) => {
      console.log('data', data);
      if (data.emailVerified) {
        console.log('redirect to /');
        router.push('/');
      } else {
        console.log('invalidate query');
        await utils.invalidateQueries(['auth.session']);
      }
    },
  });

  useEffect(() => {
    if (user?.email) {
      setValue('email', user.email);
    }
  }, [user?.email, setValue]);

  if (onboardUser.isLoading) {
    return <Spinner />;
  }

  return (
    <form
      className="flex w-full flex-col items-center justify-center gap-4"
      onSubmit={handleSubmit((data) => onboardUser.mutate(data))}
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
            !user?.email
              ? 'cursor-auto opacity-100 dark:hover:bg-dark-light'
              : 'cursor-not-allowed opacity-50'
          }`}
          autoComplete="email"
          disabled={!!user?.email}
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
