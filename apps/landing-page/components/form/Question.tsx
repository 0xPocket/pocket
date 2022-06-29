import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  register: UseFormRegisterReturn;
  header: string;
  options: string[];
};

const Question: React.FC<Props> = ({ register, header, options }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-12">
      <h1 className="max-w-3xl text-center text-3xl leading-normal md:text-4xl">
        {header}
      </h1>
      <div className="flex flex-col gap-8 md:flex-row md:text-xl">
        {options.map((option, index) => (
          <div
            className="relative min-w-[140px] rounded-lg bg-primary p-4"
            key={index}
          >
            <label className="flex items-center justify-center">{option}</label>
            <input
              {...register}
              type="radio"
              value={option}
              className="absolute inset-0 z-[100] block h-full w-full cursor-pointer opacity-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;
