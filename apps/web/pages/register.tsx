import { faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RadioGroup } from '@headlessui/react';
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

const VerifiactionFormData = z.object({
  code: z.string(),
});

const Register: FC = () => {
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
    onSuccess: () => {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, step: 3 },
      });
    },
  });

  const resendCode = trpc.email.resendCode.useMutation();
  const userType = watch('userType');
  const connectionType = watch('connectionType');
  const emailAddress = watch('email');

  const { connectAsync, connectors } = useConnect();
  const { signIn, isLoading: signInIsLoading } = useSignIn();

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

  const {
    register: verificationRegister,
    handleSubmit: handleSubmitVerification,
  } = useZodForm({
    schema: VerifiactionFormData,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  // Router effect
  useEffect(() => {
    setStep(router.query.step ? parseInt(router.query.step as string) : 0);
  }, [router]);

  useEffect(() => {
    if (step > 0 && !userType) {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, step: 0 },
      });
    }
  }, [step, router, userType]);

  const verificationCode = trpc.email.verifyCode.useMutation({
    onSuccess: () => {
      signIn('ethereum', {
        message: ethereumRegister.variables?.message,
        signature: ethereumRegister.variables?.signature,
        redirect: false,
      });
    },
  });

  const isLoading = useMemo(() => {
    return (
      ethereumRegister.isLoading ||
      verificationCode.isLoading ||
      ethereumSignMessage.isLoading ||
      magicLinkRegister.isLoading ||
      signInIsLoading ||
      magicSignIn.isLoading
    );
  }, [
    ethereumRegister.isLoading,
    verificationCode.isLoading,
    ethereumSignMessage.isLoading,
    magicLinkRegister.isLoading,
    signInIsLoading,
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
      });
    } else if (data.connectionType === 'Magic') {
      const didToken = await magicSignIn.mutateAsync(data.email);

      magicLinkRegister.mutate({
        didToken: didToken,
        name: data.name,
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

          <Stepper step={step} nbrSteps={4} />
          <div
            className=" mx-auto flex w-full flex-col justify-center gap-8 rounded-lg
					text-center"
          >
            {step === 0 && (
              <>
                <h3>
                  <FormattedMessage id="register.step0.title" />
                </h3>
                <RadioGroup
                  value={userType}
                  className="flex items-center justify-center space-x-8"
                >
                  <RadioGroup.Option
                    value="Parent"
                    className={({ checked }) =>
                      checked
                        ? 'input-radio-checked big'
                        : 'input-radio-unchecked big'
                    }
                    onClick={() => {
                      setValue('userType', 'Parent');
                      router.push({
                        pathname: router.pathname,
                        query: { ...router.query, step: 1 },
                      });
                    }}
                  >
                    <FormattedMessage id="parent" />
                  </RadioGroup.Option>
                  <RadioGroup.Option
                    value="Child"
                    className={({ checked }) =>
                      checked
                        ? 'input-radio-checked big'
                        : 'input-radio-unchecked big'
                    }
                    onClick={() => {
                      setValue('userType', 'Child');
                      router.push({
                        pathname: router.pathname,
                        query: { ...router.query, step: 1 },
                      });
                    }}
                  >
                    <FormattedMessage id="child" />
                  </RadioGroup.Option>
                </RadioGroup>
              </>
            )}
            {step === 1 && userType && (
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
                    query: { ...router.query, step: 2 },
                  });
                }}
              />
            )}
            {step === 2 && (
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
                  />
                  <InputText
                    label={formatMessage({ id: 'email' })}
                    register={register('email')}
                    autoComplete="email"
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
            {step === 3 && connectionType === 'Ethereum' && (
              <div className="flex flex-col items-center justify-center gap-8">
                <FontAwesomeIcon icon={faEnvelopeCircleCheck} size="3x" />
                <h3>
                  <FormattedMessage
                    id="register.step3.title"
                    values={{ emailAddress }}
                  />
                </h3>
                {/* <p>Follow the instructions to finish your registration</p> */}
                <form
                  className="flex w-full min-w-[350px] flex-col items-center justify-center gap-8 text-left"
                  onSubmit={handleSubmitVerification((data) => {
                    verificationCode.mutate({
                      email: emailAddress,
                      code: data.code,
                    });
                  })}
                >
                  <input
                    {...verificationRegister('code')}
                    className="rounded p-3 py-2 text-black"
                    placeholder="Verification code"
                  />
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <button className="action-btn">
                      <FormattedMessage id="submit" />
                    </button>
                  )}
                </form>
                <div className="flex gap-2 text-sm">
                  <p>
                    <FormattedMessage id="register.step3.email.notreceived" />
                  </p>
                  {resendCode.status !== 'success' && (
                    <a
                      onClick={() => {
                        if (resendCode.status !== 'loading')
                          resendCode.mutateAsync({ email: emailAddress });
                      }}
                    >
                      <FormattedMessage id="register.step3.email.sendnew" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Register;
