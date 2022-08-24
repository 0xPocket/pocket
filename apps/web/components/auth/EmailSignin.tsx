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
      className="flex flex-col items-center justify-center gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p>Connect with your email</p>
      <div className="flex gap-2">
        <input
          {...register('email')}
          className="input-text"
          autoComplete="email"
          placeholder="my@email.com"
        />
        <button
          type="submit"
          className={` ${
            formState.isValid ? 'action-btn' : 'disabled-btn'
          } flex-none`}
        >
          Sign In
        </button>
      </div>
    </form>
  );
};

export default EmailSignin;
