import type { FC } from 'react';
import { z } from 'zod';
import { useMagic } from '../../contexts/auth';
import { useZodForm } from '../../utils/useZodForm';

const EmailSchema = z.object({
  email: z.string().email(),
});

const EmailSignin: FC = () => {
  const { signInWithEmail } = useMagic();
  const { register, handleSubmit } = useZodForm({
    mode: 'all',
    reValidateMode: 'onChange',
    schema: EmailSchema,
  });

  return (
    <form
      className="flex w-full flex-col items-center justify-center gap-4"
      onSubmit={handleSubmit((data) => signInWithEmail(data.email))}
    >
      <p>Connect with your email</p>
      <div className="flex gap-2">
        <input
          {...register('email')}
          className="input-text"
          autoComplete="email"
          placeholder="my@email.com"
        />
        <button type="submit" className={`action-btn flex-none`}>
          Sign In
        </button>
      </div>
    </form>
  );
};

export default EmailSignin;
