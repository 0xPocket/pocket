import { FC, useEffect } from 'react';
import { useZodForm } from '../../../utils/useZodForm';
import { trpc } from '../../../utils/trpc';
import { AuthSchema } from '../../../server/schemas';
import { Spinner } from '../../common/Spinner';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useMagic } from '../../../contexts/auth';
import InputText from '../../common/InputText';
import FormattedMessage from '../../common/FormattedMessage';

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
      className="flex w-full min-w-[350px] flex-col items-center justify-center gap-4 text-left"
      onSubmit={handleSubmit((data) => {
        onboardUser.mutate(data);
        console.log(data);
      })}
    >
      <InputText label="Name" register={register('name')} autoComplete="name" />
      <InputText
        label="Email"
        register={register('email')}
        autoComplete="email"
      />
      <div className="mt-2 flex items-center">
        <input
          required
          type="checkbox"
          {...register('terms')}
          className="text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-4 w-4 rounded focus:ring-2"
        />
        <label className="text-gray-900 dark:text-gray-300 ml-2 text-sm font-medium">
          <FormattedMessage
            id="onboarding.terms.confirm"
            values={{
              privacy: (
                <a href="/privacy-policy" target="_blank">
                  <FormattedMessage id="onboarding.privacy" />
                </a>
              ),
              terms: (
                <a href="/terms-and-conditions" target="_blank">
                  <FormattedMessage id="onboarding.terms" />
                </a>
              ),
            }}
          />
        </label>
      </div>
      <div className="mb-2 flex items-center">
        <input
          required
          type="checkbox"
          {...register('majority')}
          className="text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-4 w-4 rounded focus:ring-2"
        />
        <label className="text-gray-900 dark:text-gray-300 ml-2 text-sm font-medium">
          <FormattedMessage id="onboarding.majority" />
        </label>
      </div>
      <button className="action-btn">
        <FormattedMessage id="submit" />
      </button>
    </form>
  );
};

export default OnBoardingForm;
