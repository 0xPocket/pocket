import { useRouter } from 'next/router';
import { FC, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useIntl } from 'react-intl';
import FormattedMessage from '../components/common/FormattedMessage';
import InputText from '../components/common/InputText';
import { Spinner } from '../components/common/Spinner';
import TitleHelper from '../components/common/TitleHelper';
import PageWrapper from '../components/common/wrappers/PageWrapper';
import RegisterProviderList from '../components/register/RegisterProviderList';
import Stepper from '../components/register/Stepper';
import { useEthereumSiwe } from '../hooks/useEthereumSiwe';
import { useMagicConnect } from '../hooks/useMagicConnect';
import { trpc } from '../utils/trpc';
import { useZodForm } from '../utils/useZodForm';
import { useConnect } from 'wagmi';
import { useSignIn } from '../hooks/useSignIn';

const FormData = z.object({
  userType: z.enum(['Parent', 'Child']),
  connectionType: z.enum(['Magic', 'Ethereum']),
  email: z.string().email(),
  name: z.string().min(2),
  ageLimit: z.literal(true),
});

const RegisterInvite: FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(0);

  const { register, handleSubmit, setValue, formState, watch } = useZodForm({
    schema: FormData,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const { formatMessage } = useIntl();

  const magicSignIn = useMagicConnect();
  const ethereumSignMessage = useEthereumSiwe({});

  const ethereumRegister = trpc.register.ethereum.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (_, { message, signature }) => {
      signIn('ethereum', {
        message,
        signature,
        redirect: false,
      });
    },
  });

  const { connectAsync, connectors } = useConnect();
  const { signIn, isLoading: signInIsLoading } = useSignIn();

  const emailAddress = watch('email');

  const magicLinkRegister = trpc.register.magic.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: async () => {
      const didToken = await magicSignIn.mutateAsync(emailAddress);

      await connectAsync({
        connector: connectors.find((c) => c.id === 'magic'),
      });

      signIn('magic', {
        token: didToken,
        redirect: false,
      });
    },
  });

  const userType = watch('userType');
  const connectionType = watch('connectionType');

  // Router effect
  useEffect(() => {
    if (router.query.type) {
      setValue('userType', router.query.type as 'Parent' | 'Child', {
        shouldValidate: true,
      });
    }
    if (router.query.name) {
      setValue('name', router.query.name as string, { shouldValidate: true });
    }
    if (router.query.email) {
      setValue('email', router.query.email as string, { shouldValidate: true });
    }
  }, [router.query.type, router.query.name, router.query.email, setValue]);

  useEffect(() => {
    if (router.query.step) {
      setStep(router.query.step ? parseInt(router.query.step as string) : 0);
    }
  }, [router.query.step, setValue]);

  useEffect(() => {
    if (step > 0 && !connectionType) {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, step: 0 },
      });
    }
  }, [step, router, connectionType]);

  const isLoading = useMemo(() => {
    return (
      ethereumRegister.isLoading ||
      ethereumSignMessage.isLoading ||
      magicLinkRegister.isLoading ||
      signInIsLoading ||
      magicSignIn.isLoading
    );
  }, [
    ethereumRegister.isLoading,
    ethereumSignMessage.isLoading,
    signInIsLoading,
    magicLinkRegister.isLoading,
    magicSignIn.isLoading,
  ]);

  const onSubmit = async (data: z.infer<typeof FormData>) => {
    if (data.connectionType === 'Ethereum') {
      const { message, signature } = await ethereumSignMessage.mutateAsync();

      ethereumRegister.mutate({
        message: JSON.stringify(message),
        signature,
        type: userType,
        email: data.email,
        name: data.name,
        invite: router.query.token
          ? {
              token: router.query.token as string,
              childId: router.query.childId as string,
              parentId: router.query.parentId as string,
            }
          : undefined,
      });
    } else if (data.connectionType === 'Magic') {
      const didToken = await magicSignIn.mutateAsync(data.email);

      magicLinkRegister.mutate({
        didToken: didToken,
        name: data.name,
        invite: router.query.token
          ? {
              token: router.query.token as string,
              childId: router.query.childId as string,
            }
          : undefined,
      });
    }
  };

  return (
    <PageWrapper>
      <TitleHelper title="Register" />
      <div className="flex flex-col items-center">
        <div className="flex w-[512px] flex-col items-center gap-16">
          <h1>
            <FormattedMessage id="register.title" />
          </h1>

          <Stepper step={step} nbrSteps={2} />
          <div
            className=" mx-auto flex w-full flex-col justify-center gap-8 rounded-lg
					text-center"
          >
            {step === 0 && userType && (
              <RegisterProviderList
                userType={userType}
                callback={(id) => {
                  if (id === 'magic') {
                    setValue('connectionType', 'Magic');
                  } else {
                    setValue('connectionType', 'Ethereum');
                  }
                  router.push({
                    pathname: router.pathname,
                    query: { ...router.query, step: 1 },
                  });
                }}
              />
            )}
            {step === 1 && (
              <form
                className="flex w-full min-w-[350px] flex-col items-center justify-center gap-8 text-left"
                onSubmit={handleSubmit(onSubmit)}
              >
                <h3>
                  <FormattedMessage id="register.step2.title" />
                </h3>
                <div className="flex min-w-[300px] flex-col gap-4">
                  <InputText
                    label={formatMessage({ id: 'name' })}
                    register={register('name')}
                    autoComplete="name"
                    disabled={!!router.query.name}
                  />
                  <InputText
                    label={formatMessage({ id: 'email' })}
                    register={register('email')}
                    autoComplete="email"
                    disabled
                  />
                </div>
                <div className=" flex items-center">
                  <input
                    required
                    type="checkbox"
                    {...register('ageLimit')}
                    className=" h-4 w-4 rounded focus:ring-2"
                  />
                  <label className="ml-2 text-sm font-medium">
                    {userType === 'Parent' && (
                      <FormattedMessage id="register.agelimit.parent" />
                    )}
                    {userType === 'Child' && (
                      <FormattedMessage id="register.agelimit.child" />
                    )}
                  </label>
                </div>
                {isLoading ? (
                  <Spinner />
                ) : (
                  <button className="action-btn" disabled={!formState.isValid}>
                    <FormattedMessage id="submit" />
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default RegisterInvite;
