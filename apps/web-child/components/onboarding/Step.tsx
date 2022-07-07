import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type StepProps = {
  children?: React.ReactNode;
  title: string;
  active: boolean;
  completed: boolean;
};

const Step: React.FC<StepProps> = ({ children, title, active, completed }) => {
  return (
    <div
      className={`flex flex-col items-center gap-4 ${
        active ? 'opacity-100' : 'pointer-events-none opacity-50'
      }`}
    >
      <h2 className="flex items-center gap-4">{title}</h2>
      {children}
    </div>
  );
};

export default Step;
