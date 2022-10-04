import { faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RadioGroup } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { z } from 'zod';
import FormattedMessage from '../components/common/FormattedMessage';
import InputText from '../components/common/InputText';
import { Spinner } from '../components/common/Spinner';
import TitleHelper from '../components/common/TitleHelper';
import PageWrapper from '../components/common/wrappers/PageWrapper';
import ProviderList from '../components/register/ProviderList';
import Stepper from '../components/register/Stepper';
import { useEthereumSiwe } from '../hooks/useEthereumSiwe';
import { useMagicConnect } from '../hooks/useMagicConnect';
import { trpc } from '../utils/trpc';
import { useZodForm } from '../utils/useZodForm';

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

  const magicSignIn = useMagicConnect();
  const ethereumSignMessage = useEthereumSiwe();

  const ethereumRegister = trpc.useMutation('register.ethereum', {
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      router.push(router.pathname + '?step=3');
    },
  });

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
      });
    } else if (data.connectionType === 'Magic') {
      const didToken = await magicSignIn.mutateAsync(data.email);

      magicLinkRegister.mutate({
        didToken: didToken,
        email: data.email,
        name: data.name,
      });
    }
  };

  return (
    <PageWrapper>
      <TitleHelper title="Register" />
      <div className="flex flex-col items-center">
        <div className="flex w-[512px] flex-col items-center gap-16">
          <h1 className="">Register to Pocket</h1>

          <Stepper step={step} nbrSteps={4} />
          <div
            className=" mx-auto flex w-full flex-col justify-center gap-8 rounded-lg
					text-center"
          >
            {step === 0 && (
              <>
                <h3>Select your account type</h3>
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
                    Parent
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
                      router.push('/register' + '?step=1');
                    }}
                  >
                    Enfant
                  </RadioGroup.Option>
                </RadioGroup>
              </>
            )}
            {step === 1 && userType && (
              <ProviderList
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
                <h3>Complete your infos</h3>
                <div className="flex min-w-[300px] flex-col gap-4">
                  <InputText
                    label="Name"
                    register={register('name')}
                    autoComplete="name"
                  />
                  <InputText
                    label="Email"
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
                      <FormattedMessage id="onboarding.majority" />
                    )}
                    {userType === 'Child' && 'Je certifie blablabla'}
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
                <h3>An email as been sent to {emailAddress} !</h3>
                {/* <p>Follow the instructions to finish your registration</p> */}
                <div className="flex gap-2 text-sm">
                  <p>{`Didn't receive ?`}</p>
                  {resendEmail.status !== 'success' && (
                    <a
                      onClick={() => {
                        if (resendEmail.status !== 'loading')
                          resendEmail.mutateAsync({ email: emailAddress });
                      }}
                    >
                      Send a new one
                    </a>
                  )}
                </div>
              </div>
            )}
            {step === 3 && connectionType === 'Magic' && (
              <div className="flex flex-col items-center justify-center gap-8">
                <h3>Your register is completed !</h3>
                <Link href="/connect">Go to connection page</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Register;
