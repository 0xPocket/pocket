import { faEnvelope, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMutation } from 'react-query';
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
  const intl = useIntl();
  const email_placeholder = intl.formatMessage({ id: 'calltoaction.eamil' });

  const mutation = useMutation(
    (data: FormValues) =>
      fetch('/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    {
      onMutate: (data) =>
        router.push(
          '/survey?email=' + data.email,
          '/survey?email=' + data.email,
          { locale: router.locale },
        ),
    },
  );

  const onSubmit = async (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex h-32 flex-col gap-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mt-8 flex h-14 max-w-md items-center justify-end rounded-lg border border-bright-darkest bg-bright text-white-darker dark:border-none"
      >
        <div className="absolute left-0">
          <FontAwesomeIcon icon={faEnvelope} className="px-4 opacity-70" />
          <input
            className="h-full flex-grow appearance-none outline-none "
            placeholder={email_placeholder}
            type="email"
            {...register('email')}
          />
        </div>
        <button
          type="submit"
          className="z-10 flex h-full w-28 cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap rounded-lg bg-primary px-4 py-3 text-bright dark:bg-primary"
        >
          {mutation.isLoading ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : (
            <FormattedMessage id="calltoaction.action" />
          )}
        </button>
      </form>
      {errors.email && (
        <span className="max-w-fit text-sm text-white-darker">
          <FormattedMessage id="calltoaction.error" />
        </span>
      )}
    </div>
  );
};

export default CallToAction;
