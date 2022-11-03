import { useRouter } from 'next/router';
import { FC, Fragment } from 'react';

type StepperProps = { step: number; nbrSteps: number };

const Stepper: FC<StepperProps> = ({ step, nbrSteps }) => {
  const steps = [...Array(nbrSteps)];
  const { pathname, push, query } = useRouter();

  return (
    <div className="stepper relative flex w-full items-center justify-between">
      {steps.map((el, i) => {
        if (i === 0) {
          return (
            <div
              key={i}
              onClick={() => {
                if (step > i && step != nbrSteps - 1)
                  push({ pathname, query: { ...query, step: i } });
              }}
              className={`step ${step === 0 && 'active'} ${
                step > 0 && 'completed cursor-pointer'
              }`}
            >
              {i + 1}
            </div>
          );
        }
        if (i === nbrSteps - 1) {
          return (
            <Fragment key={i}>
              <div className="btw-step">
                <div
                  className={`fill ${step >= nbrSteps - 1 && 'completed'}`}
                ></div>
              </div>
              <div
                onClick={() => {
                  if (step > i && step != nbrSteps - 1)
                    push({ pathname, query: { ...query, step: i } });
                }}
                className={`step ${step === nbrSteps - 1 && 'completed'}`}
              >
                {i + 1}
              </div>
            </Fragment>
          );
        }

        return (
          <Fragment key={i}>
            <div className="btw-step">
              <div className={`fill ${step >= i && 'completed'}`}></div>
            </div>
            <div
              onClick={() => {
                if (step > i && step != nbrSteps - 1)
                  push({ pathname, query: { ...query, step: i } });
              }}
              className={`step ${step === i && 'active'} ${
                step > i && 'completed cursor-pointer'
              }`}
            >
              {i + 1}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
