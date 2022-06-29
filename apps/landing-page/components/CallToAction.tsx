import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { formSchema } from '../pages/survey';

type FormValues = z.infer<typeof formSchema>;

const CallToAction: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    await fetch('/api/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    router.push('/survey?email=' + data.email);
  };

  return (
    <div className="flex h-32 flex-col gap-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 flex h-14 max-w-md items-center justify-evenly rounded-lg border border-bright-darkest bg-bright text-white-darker dark:border-none"
      >
        <FontAwesomeIcon icon={faEnvelope} className="px-4 opacity-70" />
        <input
          className="h-full flex-grow appearance-none outline-none"
          placeholder="Adresse email"
          type="email"
          {...register('email')}
        />
        <input
          type="submit"
          value="Commencer"
          className="flex h-full cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap rounded-lg bg-primary px-4 py-3 text-bright dark:bg-primary"
        />
      </form>
      {errors.email && (
        <span className="max-w-fit text-sm text-white-darker">
          Vous devez rentrer un email valide
        </span>
      )}
    </div>
  );
};

export default CallToAction;
