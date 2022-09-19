import { faEnvelope, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { env } from 'config/env/client';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
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
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const email_placeholder = intl.formatMessage({ id: 'calltoaction.email' });

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
    const token = await recaptchaRef.current?.executeAsync();
    mutation.mutate({
      ...data,
      captcha: token,
    });
  };

  const onReCAPTCHAChange = (captchaCode: string | null) => {
    // If the reCAPTCHA code is null or undefined indicating that
    // the reCAPTCHA was expired then return early
    if (!captchaCode || !recaptchaRef) {
      return;
    }
    // Reset the reCAPTCHA so that it can be executed again if user
    // submits another email.
    recaptchaRef.current?.reset();
  };

  return (
    <div className="flex flex-col gap-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex h-14 max-w-md items-center justify-end rounded-lg border border-bright-darkest bg-bright text-white-darker dark:border-none md:mt-8"
      >
        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          sitekey={env.NEXT_PUBLIC_RECAPTCHA_PUBLIC_KEY}
          hidden={true}
          onChange={onReCAPTCHAChange}
        />
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
