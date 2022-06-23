import React from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  register: UseFormRegisterReturn;
  header: string;
  onClick: () => void;
  error?: FieldError | undefined;
};

const QuestionText: React.FC<Props> = ({
  register,
  header,
  onClick,
  error,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-12">
      <h1 className="max-w-3xl leading-normal">{header}</h1>
      <div className="flex flex-col items-center gap-8 text-xl">
        <div className="flex flex-col gap-2">
          <input
            {...register}
            placeholder="Adresse email"
            className="w-96 rounded-md p-2 text-black"
          />
          {error && (
            <span className=" text-sm text-white-darker">
              Vous devez rentrer un email valide
            </span>
          )}
        </div>
        <button
          onClick={async () => {
            if (!error) onClick();
          }}
          className="w-32 rounded-lg bg-primary p-2 font-bold disabled:cursor-not-allowed disabled:bg-white-darker"
          disabled={!!error}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default QuestionText;
