import { RadioGroup } from '@headlessui/react';
import { getCsrfToken } from 'next-auth/react';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { SiweMessage } from 'siwe';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';
import EmailSignin from '../components/auth/EmailSignin';
import FormattedMessage from '../components/common/FormattedMessage';
import InputText from '../components/common/InputText';
import TitleHelper from '../components/common/TitleHelper';
import PageWrapper from '../components/common/wrappers/PageWrapper';
import EthereumConnect from '../components/register/EthereumConnect';
import { trpc } from '../utils/trpc';

type FormData = {
  userType: 'Parent' | 'Child';
  connectionType: 'Magic' | 'Ethereum';
  email: string;
  name: string;
  ageLimit: boolean;
};
const Register: FC = () => {
  const [step, setStep] = useState<number>(1);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const { register, handleSubmit, setValue, getValues, formState, watch } =
    useForm<FormData>({
      mode: 'onChange',
      reValidateMode: 'onChange',
      defaultValues: {
        userType: 'Parent',
      },
    });

  const ethereumRegister = trpc.useMutation('register.ethereum');

  const userType = watch('userType');

  const onSubmit = async (data: FormData) => {
    if (data.connectionType === 'Ethereum') {
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        // HELP
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

      setStep(3);
    }
  };

  return (
    <PageWrapper>
      <TitleHelper title="Register" />
      <div className="flex flex-col items-center">
        <h1 className="pb-8">Register to Pocket</h1>
        <div className="stepper flex w-[250px] items-center justify-between pb-4">
          <div
            className={`step ${step === 1 && 'active'} ${
              step > 1 && 'completed'
            }`}
          >
            1
          </div>
          <div className="btw-step">
            <div className={`fill ${step >= 2 && 'completed'}`}></div>
          </div>
          <div
            className={`step ${step === 2 && 'active'} ${
              step > 2 && 'completed'
            }`}
          >
            2
          </div>
          <div className="btw-step">
            <div className={`fill ${step >= 3 && 'completed'}`}></div>
          </div>
          <div className={`step ${step === 3 && 'completed'}`}>3</div>
        </div>

        <div
          className="container-classic mx-auto flex max-w-sm flex-col justify-center gap-8 rounded-lg p-8
				text-center"
        >
          {step === 1 && (
            <>
              <RadioGroup
                value={userType}
                onChange={(userType: 'Parent' | 'Child') => {
                  setValue('userType', userType);
                }}
                className="flex items-center justify-center space-x-8"
              >
                <RadioGroup.Option
                  value="Parent"
                  className={({ checked }) =>
                    checked ? 'input-radio-checked' : 'input-radio-unchecked'
                  }
                >
                  Parent
                </RadioGroup.Option>
                <RadioGroup.Option
                  value="Child"
                  className={({ checked }) =>
                    checked ? 'input-radio-checked' : 'input-radio-unchecked'
                  }
                >
                  Enfant
                </RadioGroup.Option>
              </RadioGroup>

              {userType === 'Parent' && (
                <div className="flex flex-col items-center gap-4">
                  <EmailSignin />
                  <div className="flex w-72 items-center">
                    <div className="w-full border-b opacity-25"></div>
                    <h2 className="mx-2 text-lg font-bold">
                      <FormattedMessage id="or" />
                    </h2>
                    <div className="w-full border-b opacity-25"></div>
                  </div>
                  <EthereumConnect
                    callback={() => {
                      setStep(2);
                      setValue('connectionType', 'Ethereum');
                    }}
                  />
                </div>
              )}
              {userType === 'Child' && (
                <EthereumConnect
                  callback={() => {
                    setStep(2);
                    setValue('connectionType', 'Ethereum');
                  }}
                />
              )}
              <button onClick={() => setStep(2)}>next</button>
            </>
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
          {step === 3 && <h2>Verify mail</h2>}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Register;
