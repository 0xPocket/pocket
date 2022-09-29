import { RadioGroup } from '@headlessui/react';
import { FC, useState } from 'react';
import ChildSignin from '../components/auth/ChildSignin';
import EmailSignin from '../components/auth/EmailSignin';
import EthereumSignin from '../components/auth/EthereumSignin';
import FormattedMessage from '../components/common/FormattedMessage';
import InputText from '../components/common/InputText';
import TitleHelper from '../components/common/TitleHelper';
import PageWrapper from '../components/common/wrappers/PageWrapper';
import OnBoardingForm from '../components/onboarding/parent/OnBoardingForm';

const Register: FC = () => {
  const [selected, setSelected] = useState('parent');
  const [step, setStep] = useState<number>(1);

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
                value={selected}
                onChange={setSelected}
                className="flex items-center justify-center space-x-8"
              >
                <RadioGroup.Option
                  value="parent"
                  className={({ checked }) =>
                    checked ? 'input-radio-checked' : 'input-radio-unchecked'
                  }
                >
                  Parent
                </RadioGroup.Option>
                <RadioGroup.Option
                  value="child"
                  className={({ checked }) =>
                    checked ? 'input-radio-checked' : 'input-radio-unchecked'
                  }
                >
                  Enfant
                </RadioGroup.Option>
              </RadioGroup>

              {selected === 'parent' && (
                <div className="flex flex-col items-center gap-4">
                  <EmailSignin />
                  <div className="flex w-72 items-center">
                    <div className="w-full border-b opacity-25"></div>
                    <h2 className="mx-2 text-lg font-bold">
                      <FormattedMessage id="or" />
                    </h2>
                    <div className="w-full border-b opacity-25"></div>
                  </div>
                  <EthereumSignin type="Parent" />
                </div>
              )}
              {selected === 'child' && <EthereumSignin type="Child" />}
              <button onClick={() => setStep(2)}>next</button>
            </>
          )}
          {step === 2 && (
            <form
              className="flex w-full min-w-[350px] flex-col items-center justify-center gap-4 text-left"
              onSubmit={() => setStep(3)}
            >
              {/* <InputText
                label="Name"
                register={register('name')}
                autoComplete="name"
              />
              <InputText
                label="Email"
                register={register('email')}
                autoComplete="email"
              /> */}
              <div className="mb-2 flex items-center">
                <input
                  required
                  type="checkbox"
                  // {...register('majority')}
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
          )}
          {step === 3 && <h2>Verify mail</h2>}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Register;
