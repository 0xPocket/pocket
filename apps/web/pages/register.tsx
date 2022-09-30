import { RadioGroup } from '@headlessui/react';
import { Magic } from 'magic-sdk';
import { getCsrfToken } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { SiweMessage } from 'siwe';
import { useAccount, useConnect, useNetwork, useSignMessage } from 'wagmi';
import FormattedMessage from '../components/common/FormattedMessage';
import InputText from '../components/common/InputText';
import TitleHelper from '../components/common/TitleHelper';
import PageWrapper from '../components/common/wrappers/PageWrapper';
import ProviderList from '../components/register/ProviderList';
import Stepper from '../components/register/Stepper';
import { MagicConnector } from '../utils/MagicConnector';
import { trpc } from '../utils/trpc';

type FormData = {
  userType: 'Parent' | 'Child';
  connectionType: 'Magic' | 'Ethereum';
  email: string;
  name: string;
  ageLimit: boolean;
};

const Register: FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const { address } = useAccount();
  const { connectors } = useConnect();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const { register, handleSubmit, setValue, getValues, formState, watch } =
    useForm<FormData>({
      mode: 'onChange',
      reValidateMode: 'onChange',
    });

  const [magicSDK, setMagicSDK] = useState<Magic>();

  const ethereumRegister = trpc.useMutation('register.ethereum');
  const magicLinkRegister = trpc.useMutation('register.magic');
  const resendEmail = trpc.useMutation(['email.resendVerificationEmail']);

  const userType = watch('userType');
  const connectionType = watch('connectionType');
  const emailAddress = watch('email');

  // Router effect
  useEffect(() => {
    setStep(router.query.step ? parseInt(router.query.step as string) : 0);
  }, [router]);

  // Get magic sdk
  useEffect(() => {
    const sdk = (
      connectors.find((e) => e.id === 'magic') as MagicConnector
    ).getMagicSDK();
    setMagicSDK(sdk);
  }, []);

  const onSubmit = async (data: FormData) => {
    if (data.connectionType === 'Ethereum') {
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign this message to access Pocket.',
        uri: window.location.origin,
        version: '1',
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      await ethereumRegister.mutateAsync({
        message: JSON.stringify(message),
        signature,
        type: userType,
        email: data.email,
        name: data.name,
      });
    } else if (data.connectionType === 'Magic') {
      await magicSDK?.auth.loginWithMagicLink({
        email: data.email,
      });
      const didToken = await magicSDK?.user.getIdToken();
      if (!didToken) {
        throw new Error('No DID token found.');
      }
      await magicLinkRegister.mutateAsync({
        didToken: didToken,
        email: data.email,
        name: data.name,
      });
    }
    router.push(router.pathname + '?step=3');
  };

  return (
    <PageWrapper>
      <TitleHelper title="Register" />
      <div className="flex flex-col items-center">
        <h1 className="pb-8">Register to Pocket</h1>

        <div className="w-[512px]">
          <Stepper step={step} nbrSteps={4} />
          <div
            className="container-classic mx-auto flex w-full flex-col justify-center gap-8 rounded-lg p-16
					text-center"
          >
            {step === 0 && (
              <>
                <h2>Select your account type</h2>
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
                className="flex w-full min-w-[350px] flex-col items-center justify-center gap-4 text-left"
                onSubmit={handleSubmit(onSubmit)}
              >
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
                <div className="mb-2 flex items-center">
                  <input
                    required
                    type="checkbox"
                    {...register('ageLimit', {
                      validate: (value) => value === true,
                    })}
                    className="text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-4 w-4 rounded focus:ring-2"
                  />
                  <label className="text-gray-900 dark:text-gray-300 ml-2 text-sm font-medium">
                    <FormattedMessage id="onboarding.majority" />
                  </label>
                </div>
                <button className="action-btn" disabled={!formState.isValid}>
                  <FormattedMessage id="submit" />
                </button>
              </form>
            )}
            {step === 3 && connectionType === 'Ethereum' && (
              <div className="flex flex-col items-center justify-center gap-4">
                <h2>An email as been sent to {emailAddress} !</h2>
                <p>Follow the instructions to finish your registration</p>
                <div className="flex gap-2">
                  <p>{`Didn't receive ?`}</p>
                  {resendEmail.status !== 'success' && (
                    <a
                      onClick={() => {
                        if (resendEmail.status !== 'loading')
                          resendEmail.mutateAsync();
                      }}
                    >
                      Send a new one
                    </a>
                  )}
                </div>
              </div>
            )}
            {step === 3 && connectionType === 'Magic' && (
              <div className="flex flex-col items-center justify-center gap-4">
                <h2>Your register is completed !</h2>
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
