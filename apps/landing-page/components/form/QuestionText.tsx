import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  register: UseFormRegisterReturn;
  header: string;
  onClick: () => void;
};

const QuestionText: React.FC<Props> = ({ register, header, onClick }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-12">
      <h1 className="max-w-3xl leading-normal">{header}</h1>
      <div className="flex flex-col items-center gap-8 text-xl">
        <input
          {...register}
          placeholder="Adresse email"
          className="w-96 rounded-md p-2 text-black"
        />
        <button
          onClick={onClick}
          className="w-32 rounded-lg bg-primary p-2 font-bold"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default QuestionText;
