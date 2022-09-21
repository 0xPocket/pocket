import { type FC, useEffect } from 'react';
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
  console.log(formState.errors);

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
      <button className="action-btn">
        <FormattedMessage id="submit" />
      </button>
    </form>
  );
};

export default OnBoardingForm;
