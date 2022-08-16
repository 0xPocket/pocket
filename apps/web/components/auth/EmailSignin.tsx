import { useRouter } from 'next/router';
import type { FC } from 'react';
import { z } from 'zod';
import { useMagic } from '../../contexts/auth';
import { useZodForm } from '../../utils/useZodForm';

const EmailSchema = z.object({
  email: z.string().email(),
});

const EmailSignin: FC = () => {
  const router = useRouter();
  const { signInWithEmail } = useMagic();
  const { register, handleSubmit, formState } = useZodForm({
    mode: 'all',
    reValidateMode: 'onChange',
    schema: EmailSchema,
  });

  const onSubmit = async (data: z.infer<typeof EmailSchema>) => {
    await signInWithEmail(data.email).then(() => {
      router.push('/');
    });
  };

  return (
    <form
      className="flex w-full flex-col items-center justify-center gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        {...register('email')}
        className="without-ring container-classic w-full border border-dark-lightest/50 p-2 px-4 font-thin shadow dark:border-white-darker dark:bg-dark"
        autoComplete="email"
        placeholder="Email"
      />
      <input
        type="submit"
        className={`container-classic flex w-full cursor-pointer justify-center p-2 px-4 font-thin transition-all dark:bg-dark-light/50 ${
          formState.isValid
            ? 'cursor-pointer opacity-100 dark:hover:bg-dark-light'
            : 'cursor-not-allowed opacity-25'
        }`}
        value="Sign in with email"
      />
    </form>
  );
};

export default EmailSignin;
