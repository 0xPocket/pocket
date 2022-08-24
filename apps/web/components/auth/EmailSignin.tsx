import { useRouter } from 'next/router';
import type { FC } from 'react';
import { z } from 'zod';
import { useMagic } from '../../contexts/auth';
import { trpc } from '../../utils/trpc';
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

  const utils = trpc.useContext();

  const onSubmit = async (data: z.infer<typeof EmailSchema>) => {
    await signInWithEmail(data.email).then(async () => {
      await utils.invalidateQueries(['auth.me']);
      router.push('/');
    });
  };

  return (
    <form
      className="flex w-full flex-col items-center justify-center gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p>Connect with your email</p>

      <input
        {...register('email')}
        className=""
        autoComplete="email"
        placeholder="Email"
      />
      <button
        type="submit"
        className={` ${formState.isValid ? 'action-btn' : 'disabled-btn'}`}
      >
        Sign in with email
      </button>
    </form>
  );
};

export default EmailSignin;
