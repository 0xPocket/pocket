import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  register: UseFormRegisterReturn;
  header: string;
};

const Question: React.FC<Props> = ({ register, header }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <h1>{header}</h1>
      <div className="flex gap-8 text-xl">
        <label>
          <input {...register} type="radio" value="Oui" className="m-2" />
          Oui
        </label>
        <label>
          <input {...register} type="radio" value="Non" className="m-2" />
          Non
        </label>
      </div>
    </div>
  );
};

export default Question;
