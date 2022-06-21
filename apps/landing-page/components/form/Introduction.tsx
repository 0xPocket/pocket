import React from 'react';

type Props = {
  onClick: () => void;
};

const Introduction: React.FC<Props> = ({ onClick }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <h1>👋 Merci de votre interet pour notre produit !</h1>
      <h3>
        Aidez nous a ameliorer le produit en repondant a quelques questions.
      </h3>
      <button onClick={onClick} className="rounded-lg bg-primary p-4 font-bold">
        Commencer
      </button>
    </div>
  );
};

export default Introduction;
