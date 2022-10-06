import { faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RadioGroup } from '@headlessui/react';
import Link from 'next/link';
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

// update on routers also
const PRIVATE_BETA = false;

const FormData = z.object({
  userType: z.enum(['Parent', 'Child']),
  connectionType: z.enum(['Magic', 'Ethereum']),
  email: z.string().email(),
  name: z.string().min(2),
  ageLimit: z.literal(true),
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

  const ethereumRegister = trpc.useMutation('register.ethereum', {
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      router.push(router.pathname + '?step=3');
    },
  });

  // BETA TOKEN
  const [betaToken, setBetaToken] = useState<string>();
  trpc.useQuery(
    ['beta.verifyInvite', { token: router.query.token as string }],
    {
      enabled: PRIVATE_BETA,
      retry: false,
      onSuccess: () => setBetaToken(router.query.token as string),
    },
  );

  const magicLinkRegister = trpc.useMutation('register.magic', {
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      router.push(router.pathname + '?step=3');
    },
  });

  const resendEmail = trpc.useMutation(['email.resendVerificationEmail']);
  const userType = watch('userType');
  const connectionType = watch('connectionType');
  const emailAddress = watch('email');

  // Router effect
  useEffect(() => {
    setStep(router.query.step ? parseInt(router.query.step as string) : 0);
  }, [router]);

  useEffect(() => {
    if (step > 0 && !userType) {
      router.push('/register?step=0');
    }
  }, [step, router, userType]);

  const isLoading = useMemo(() => {
    return (
      ethereumRegister.isLoading ||
      ethereumSignMessage.isLoading ||
      magicLinkRegister.isLoading ||
      magicSignIn.isLoading
    );
  }, [
    ethereumRegister.isLoading,
    ethereumSignMessage.isLoading,
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
        token: betaToken,
      });
    } else if (data.connectionType === 'Magic') {
      const didToken = await magicSignIn.mutateAsync(data.email);

      magicLinkRegister.mutate({
        didToken: didToken,
        email: data.email,
        name: data.name,
        token: betaToken,
      });
    }
  };

  if (PRIVATE_BETA && !betaToken)
    return (
      <PageWrapper>
        <div className="flex flex-col items-center">
          <div className="flex w-[512px] flex-col items-center gap-16">
            <h1>Pocket is currently in private beta</h1>
            <p>If you want to try it, reach us on social media</p>
          </div>
        </div>
      </PageWrapper>
    );

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
                      router.push('/register' + '?step=1');
                    }}
                  >
                    <FormattedMessage id="parent" />
                  </RadioGroup.Option>
                  <RadioGroup.Option
                    value="Child"
                    className={({ checked }) =>
                      checked
                        ? 'input-radio-checked big'
                        : 'input-radio-unchecked big cursor-not-allowed opacity-30'
                    }
                    onClick={() => {
                      setValue('userType', 'Child');
                      router.push('/register' + '?step=1');
                    }}
                    disabled
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
                  router.push('/register' + '?step=2');
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
                <div className="flex gap-2 text-sm">
                  <p>
                    <FormattedMessage id="register.step3.email.notreceived" />
                  </p>
                  {resendEmail.status !== 'success' && (
                    <a
                      onClick={() => {
                        if (resendEmail.status !== 'loading')
                          resendEmail.mutateAsync({ email: emailAddress });
                      }}
                    >
                      <FormattedMessage id="register.step3.email.sendnew" />
                    </a>
                  )}
                </div>
              </div>
            )}
            {step === 3 && connectionType === 'Magic' && (
              <div className="flex flex-col items-center justify-center gap-8">
                <h3>
                  <FormattedMessage id="register.step3.completed" />
                </h3>
                <Link href="/connect">
                  <a>
                    <FormattedMessage id="register.step3.gotoconnect" />
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Register;
