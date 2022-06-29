import React from 'react';

type Props = {
  onClick: () => void;
};

const Introduction: React.FC<Props> = ({ onClick }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 text-center">
      <h1>👋 Merci de votre intérêt pour notre produit !</h1>
      <h3>
        Aidez nous à améliorer le produit en répondant à quelques questions.
      </h3>
      <button
        onClick={onClick}
        className="rounded-lg bg-primary p-4 text-white"
      >
        Commencer
      </button>
    </div>
  );
};

export default Introduction;
