import type { FC } from 'react';

type StepperProps = { step: number };

const Stepper: FC<StepperProps> = ({ step }) => {
  return (
    <div className="stepper flex w-[250px] items-center justify-between pb-4">
      <div
        className={`step ${step === 1 && 'active'} ${step > 1 && 'completed'}`}
      >
        1
      </div>
      <div className="btw-step">
        <div className={`fill ${step >= 2 && 'completed'}`}></div>
      </div>
      <div
        className={`step ${step === 2 && 'active'} ${step > 2 && 'completed'}`}
      >
        2
      </div>
      <div className="btw-step">
        <div className={`fill ${step >= 3 && 'completed'}`}></div>
      </div>
      <div className={`step ${step === 3 && 'completed'}`}>3</div>
    </div>
  );
};

export default Stepper;
